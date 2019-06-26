import * as React from 'react';
import { Component } from 'react';

class DragDrop extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  dragCounter = 0;

  state = {
    drag: false
  };

  handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = e => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };

  handleDragOut = e => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  };

  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });

    var regexPatt = /\.[0-9a-z]+$/i;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (var file in e.dataTransfer.files) {
        var extension = e.dataTransfer.files[file].path
          .match(regexPatt)[0]
          .replace('.', '');

        if (this.props.fileTypes.indexOf(extension) > -1) {
          this.props.handleDrop(e.dataTransfer.files, true);
          console.log(
            'File(s) is compatible with this action and can now do what you want with it :)'
          );
        } else {
          this.props.handleDrop(e.dataTransfer.files, false);
          console.log('File(s) is incompatible with this action');
        }
      }

      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  render() {
    return (
      <div
        style={Object.assign({}, this.props.className, this.props.stateTheme.dragDrop)}
        onDrop={this.handleDrop}
        onDragOver={this.handleDrag}
        onDragLeave={this.handleDragOut}
        onDragEnter={this.handleDragIn}
      >
        {this.state.drag == true ? (
          <div style={Object.assign({}, this.props.stateTheme.dragDrop.draggedBackground)}>
            <div style={Object.assign({}, this.props.stateTheme.dragDrop.draggedBackground.title)}>{this.props.draggedTitle}</div>
          </div>
        ) : null}
        <div style={Object.assign({}, this.state.drag ? this.props.stateTheme.dragDrop.content : null)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
export { DragDrop };

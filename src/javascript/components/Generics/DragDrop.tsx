import * as React from 'react';
import { Component } from 'react';

const styles: any = require('./DragDrop.scss');

class DragDrop extends Component<any,any> {
    
    constructor(props) {
        super(props);
      }

    dragCounter = 0;

    state = {
        drag: false
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({drag: true})
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({drag: false})
        }
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({drag: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0    
        }
    }

    render() {
        return (
        <div className={`${this.props.className} ${styles.dragDrop}`} onDrop={this.handleDrop} onDragOver={this.handleDrag} onDragLeave={this.handleDragOut} onDragEnter={this.handleDragIn} >
            {this.state.drag == true? 
                <div className={styles.draggedBackground}>
                    <div className={styles.draggedTitle}>
                        Drop Here
                    </div>
                </div>
            :
                null
            }
            {this.props.children}
        </div>
        )
    }
}
export { DragDrop }


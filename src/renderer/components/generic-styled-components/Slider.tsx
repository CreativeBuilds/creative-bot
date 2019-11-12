import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import {
    accentColor,
    secondaryAccentColor,
    sliderRailBackgroundColor
} from '@/renderer/helpers/appearance';
import styled from 'styled-components';
import Input from 'react-select/src/components/Input';
//import Slider, { Range } from 'rc-slider';
//import 'rc-slider/assets/index.css';

interface ISliderProps {
    header?: string;
    minValue: number;
    maxValue: number;
    value: number;
    onChange?: () => void;
    onValueChanged?: (e: number) => void;
}

const RangeInputWrapper = styled.div`
    width: 100%;

    > input {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: ${sliderRailBackgroundColor};
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
        border-radius: 5px
    }

    > input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background: ${accentColor};
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 1px 1px 3px #000000 ;

        &:hover {
            background: ${secondaryAccentColor};
        }
    }
`;

const SliderWrapper = styled.div`
    width: 100%;
    margin-top: 5px;
`;

const SliderHeader = styled.div`
    width: 100%;
    display: inline-block;
    user-select: none;
`;

const SliderHeaderTitle = styled.div`
    display: inline-block;
`;

const SliderHeaderValue = styled.div`
    display: inline-block;
    float: right;
`;

export const Slider = (props: ISliderProps) => {
    const [Value, setValue] = React.useState<number>(props.value);

    return (
        <SliderWrapper>
            <SliderHeader>
                <SliderHeaderTitle>
                    {props.header}
                </SliderHeaderTitle>
                <SliderHeaderValue>
                    {Value}
                </SliderHeaderValue>
            </SliderHeader>
            <RangeInputWrapper>
                <input type="range" min={props.minValue} max={props.maxValue} defaultValue={props.value} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setValue(parseInt(e.currentTarget.value))
                        if (props.onValueChanged != null) {
                            props.onValueChanged(parseInt(e.currentTarget.value)); 
                        }
                    }
                } />
            </RangeInputWrapper>
        </SliderWrapper>
    );

};
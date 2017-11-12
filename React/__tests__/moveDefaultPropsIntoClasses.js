import jscodeshift from 'jscodeshift';
const transform = require('../moveDefaultPropsIntoClasses').default;

const afterTransform = (source, path = 'test.js') => {
    return transform({ path, source }, { jscodeshift }, {});
};
  

test('expected output is correct', () => {
    const input = `
    /* @flow */
    import React, { Component } from 'react';
    import PropTypes from 'prop-types';
    
    export type Props = { foo?: boolean };
    
    export class Test extends Component {
        constructor(props: Props) {
            super(props);
        }
        props: Props;
    }
    
    Test.defaultProps = {
        foo: false
    };
    
    function Hello(props){
        return <div>Hello {props.name}</div>;
    }
    
    Hello.defaultProps = {name:"World"};
    
    export class Test1 extends Component {
        constructor(props: Props) {
            super(props);
        }
        props: Props;
        static defaultProps = {
            foo: true
        };
    }`;
    
    expect(afterTransform(input)).toMatchSnapshot();
})

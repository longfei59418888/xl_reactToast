import React from 'react';
import ReactDOM, {render} from 'react-dom';
import style from './index.scss'
import classnames from 'classnames'
import {CSSTransitionGroup} from 'react-transition-group' // ES6

let modalContainer = null, toasts = [], dispatch = null;


function addContainer(className) {
    if (modalContainer) return
    modalContainer = document.createElement('div');
    modalContainer.setAttribute('class', 'xl-toast_container_box ' + className);
    document.body.appendChild(modalContainer)

}

export const close = () => {
    if (!modalContainer) return
    toasts = [];
    dispatch = null;
    ReactDOM.unmountComponentAtNode(modalContainer)
    modalContainer.parentNode.removeChild(modalContainer)
    modalContainer = null
}

/*
* title
* msg
* */
export const error = (options) => {
    if(typeof options == 'string') options = {msg:options}
    options.state = 0
    toast(options)
}
export const success = (options) => {
    if(typeof options == 'string') options = {msg:options}
    options.state = 1
    toast(options)
}
export const tips = (options) => {
    if(typeof options == 'string') options = {msg:options}
    options.state = 3
    toast(options)
}
export const warn = (options) => {
    if(typeof options == 'string') options = {msg:options}
    options.state = 2
    toast(options)
}

function toast(options) {
    if (dispatch) {
        dispatch(options)
        return
    }
    addContainer(options.className);
    let ComCon = render(<ComContainer info={options}/>, modalContainer)
}

class ComContainer extends React.Component {
    state = {
        msgs: []
    }

    componentDidMount() {

        let msgs = this.state.msgs
        msgs.push(this.props.info)
        this.setState({
            msgs: msgs
        })
        dispatch = (options) => {
            msgs = this.state.msgs
            msgs.push(options)
            this.setState({
                msgs: msgs
            })
        }
        this.loop = setInterval(() => {
            msgs = this.state.msgs
            if (msgs.length == 1) {
                clearInterval(this.loop)
                close();
                return
            }
            msgs.shift()
            this.setState({
                msgs: msgs
            })
        }, 2000)
    }

    render() {
        let list = this.state.msgs
        return (<div className='box'>
            <CSSTransitionGroup
                transitionName="example-toast"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={300}>
                {list.map((item, index) => {
                    let color, img;
                    switch (item.state) {
                        case 0:
                            color = 'item-error';
                            img = require('./images/cha.png');
                            break;
                        case 1:
                            color = 'item-success';
                            img = require('./images/dui.png');
                            break;
                        case 2:
                            color = 'item-warn';
                            img = require('./images/warn.png');
                            break;
                        case 3:
                            color = 'item-tips';
                            img = require('./images/tips.png');
                            break;
                    }
                    return (<div key={index} className={classnames('item', color)}>
                        <div className="icon">
                            <img src={img} alt=""/>
                        </div>
                        <div className="info">
                            {item.title ? <h4>{item.title}</h4> : ''}
                            <p>{item.msg}</p>
                        </div>
                    </div>)
                })}
            </CSSTransitionGroup>

        </div>)
    }
}

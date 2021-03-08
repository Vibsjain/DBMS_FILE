import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import Menu from './Menu';

const Base = ({
    title = "My Title",
    description = "My description",
    className = "bg-dark text-white p-4",
    children
}) => {
    return (
        <div>
            <Menu />
            <div className = "container-fluid">
                <div className = "jumbotron bg-dark text-white text-center">
                    <h1 className="display-4">{title}</h1>
                    <p className="lead">{description}</p>
                </div>
                <div className = {className}>{children}</div>
                <footer className = "footer bg-dark mt-auto py-3">
                    <div className = "container-fluid bg-success text-white text-center py-3">
                        <h4>If you have any query, feel free to reach out!</h4>
                        <button className = "btn btn-lg btn-warning">Contact Us</button>
                    </div>
                    <div className = "container">
                        <span className = "text-muted">An amazing MERN Bootcamp...</span>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Base;
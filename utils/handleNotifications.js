import { Store } from 'react-notifications-component';
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimesCircle,
} from 'react-icons/fa';

const Title = ({ title }) => {
    return (
        <h3
            style={{
                fontSize: '16px',
                fontWeight: '800',
                marginBottom: '12px',
            }}
        >
            {title}
        </h3>
    );
};

const Message = ({ type, message }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '15px',
            }}
        >
            {type === 'success' && (
                <FaCheckCircle style={{ fontSize: '32px' }} />
            )}
            {type === 'warning' && (
                <FaExclamationTriangle style={{ fontSize: '32px' }} />
            )}
            {type === 'info' && <FaInfoCircle style={{ fontSize: '32px' }} />}
            {type === 'danger' && (
                <FaTimesCircle style={{ fontSize: '32px' }} />
            )}

            <h6
                style={{
                    display: 'inline',
                    marginLeft: '15px',
                    marginBottom: '0px',
                }}
            >
                {message}
            </h6>
        </div>
    );
};

const handleNotifications = (type, title, message) => {
    Store.addNotification({
        title: <Title title={title}></Title>,
        message: <Message type={type} message={message}></Message>,
        type: type,
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
            duration: 5000,
            onScreen: true,
            pauseOnHover: true,
        },
    });
};

export default handleNotifications;

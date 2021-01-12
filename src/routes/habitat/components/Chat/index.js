import { h } from 'preact';

const Chat = ({ height, width }) => (
  <div style={{
    height,
    maxHeight: height,
    width,
    background: 'green',
  }}>
    chat
  </div>
);

export default Chat;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [name, setName] = useState('');
  const [isEnterDisabled, setIsEnterDisabled] = useState(true);
  const navigate = useNavigate();

  function enterChat() {
    console.log('name is:', name);
    navigate('/chat', { state: { name } });
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setName(name);
    setIsEnterDisabled(name.length === 0);
  }

  return (
    <>
      <h1>Home</h1>
      <label>
        Your name:<br/>
        <input
          type="text"
          value={name}
          onChange={onInputChange}
          placeholder="You Name"
        />
      </label>
      <div>
        <button
          onClick={enterChat}
          disabled={isEnterDisabled}
        >Enter</button>
      </div>
    </>
  );
}
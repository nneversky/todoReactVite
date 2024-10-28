import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { addTask, removeTask, resetTask } from './store/todoSlice'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Button, Form, InputGroup, ListGroup, Modal, Container, Toast } from 'react-bootstrap'

const App = () => {
  const tasks = useSelector(state => state.tasks.tasks)
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [theme, setTheme] = useState('dark')
  const [show, setShow] = useState(false)
  const [resetText, setResetText] = useState({idText : '', newText : '', oldText : ''})
  const [lang, setLang] = useState('ру')
  const [err, setErr] = useState(false)


  const toggleLang = () => {
    return <Button onClick={() => (lang === 'ру') ? setLang('en') : setLang('ру')}>{lang}</Button>
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleChangeModal = (e) => {
    setResetText({idText : resetText.idText, newText : e.target.value, oldText : resetText.oldText})
  }

  const handleClick = () => {
    dispatch(addTask(text))
    setText('')
  }

  const toggleTheme = () => {
    return <Button variant={theme} onClick={() => {
      return (theme === 'dark') ? setTheme('light') : setTheme('dark')
    }}>Theme</Button>
  }

  const handleShowModal = (id, text) => {
    setResetText({idText : id, newText : resetText.newText, oldText : text})
    setShow(true)
  }

  const handleCloseModal = () => {
    setResetText({idText : '', newText : '', oldText : ''})
    setShow(false)
    setErr(false)
  }

  const handleCloseModalSave = () => {
    try {
      dispatch(resetTask([resetText.idText, resetText.newText]))
      setShow(false)
      setErr(false)
    } catch (e) {
      setShow(true)
      setErr(true)
    }
    // dispatch(resetTask([resetText.idText, resetText.newText]))
    // setShow(false)
  }

  const onKeyDown = (e) => {
    switch(e.key) {
      case('Enter'):
        return handleCloseModalSave()
      case('Escape'):
        return handleCloseModal()
    }
  }


  return (
    <div>
      <InputGroup>
        <Button variant="warning" onClick={() => handleClick()}>Add Task</Button>
        <Form.Control placeholder='Enter task' type="text" value={text} onKeyDown={(e) => {if(e.key === 'Enter') return handleClick()}} onChange={(e) => handleChange(e)}/>
        {toggleTheme()}
        {toggleLang()}
      </InputGroup>
      <ListGroup>
        {tasks.map(value => {
          return <ListGroup.Item className='listGroup' key={value.id}>{value.text}
            <Button style={{'margin' : '5px'}} onClick={() => dispatch(removeTask(value.id))}>Remove</Button>
            <Button onClick={() => handleShowModal(value.id, value.text)}>Reset</Button>
          </ListGroup.Item>
        })}
      </ListGroup>
      <Modal show={show} backdrop='static'>
        <Modal.Header>
          <Modal.Title>Reset task</Modal.Title>
          <Form.Control placeholder={resetText.oldText} type='text' onChange={(e) => handleChangeModal(e)} onKeyDown={
            (e) => onKeyDown(e)}/>
        </Modal.Header>
        <Modal.Footer>
        <Container className='group'>
          <Toast show={err} onClose={() => setErr(false)}>
            <Toast.Header>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>Enter text</Toast.Body>
          </Toast>
        </Container>
          <Button onClick={() => handleCloseModalSave()}>Save</Button>
          <Button variant="secondary" onClick={() => handleCloseModal()}>Esc</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default App
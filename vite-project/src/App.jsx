import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { addTask, removeTask, resetTask } from './store/todoSlice'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Button, Form, InputGroup, ListGroup, Modal, Image} from 'react-bootstrap'
import trash from './assets/trash.svg'
import addTaskBtn from './assets/add.svg'
import resetBtn from './assets/reset.svg'



const App = () => {
  const tasks = useSelector(state => state.tasks.tasks)
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [theme, setTheme] = useState('dark')
  const [show, setShow] = useState(false)
  const [resetText, setResetText] = useState({idText : '', newText : '', oldText : ''})
  const [lang, setLang] = useState('ru')


  const toggleLang = () => {
    return <Button onClick={() => (lang === 'ru') ? setLang('en') : setLang('ru')}>{lang}</Button>
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
  }

  const handleCloseModalSave = () => {
    try {
      dispatch(resetTask([resetText.idText, resetText.newText]))
      setShow(false)
    } catch (e) {
      setShow(true)
    }
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
        <Button variant="warning" onClick={() => handleClick()}>Add 
        </Button>
        <Form.Control placeholder='Enter task' type="text" value={text} onKeyDown={(e) => {if(e.key === 'Enter') return handleClick()}} onChange={(e) => handleChange(e)}/>
        {toggleTheme()}
        {toggleLang()}
      </InputGroup>
      <ListGroup>
        {tasks.map(value => {
          return <ListGroup.Item className='listGroup' key={value.id}>{value.text}
            <Button style={{'margin' : '5px'}} onClick={() => dispatch(removeTask(value.id))}>
            <Image className='btnWhite' src={trash}/>
            </Button>
            <Button onClick={() => handleShowModal(value.id, value.text)}>
            <Image src={resetBtn}/>
            </Button>
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
          <Button onClick={() => handleCloseModalSave()}>Save</Button>
          <Button variant="secondary" onClick={() => handleCloseModal()}>Esc</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default App
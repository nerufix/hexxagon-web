import {Button} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'


function Emojis({ client, latestEmoji, id }) {

  const history = useHistory()

  const [emojis, setEmojis] = useState([])
  
  useEffect(() => {
    if (latestEmoji) {
      setEmojis([...emojis, {...latestEmoji, style: {animation: "4s float-"+Math.ceil(Math.random()*10)}}])
      const latestId = latestEmoji.id
      console.log(emojis)
      //setTimeout(() => setEmojis([...emojis.filter(el => el.id!==latestId)]), 4000)
    }
  }, [latestEmoji])

  useEffect(() => {
    client.subscribe('emojis/'+id, {qos: 1})
  }, [])

  const handleEmojiClick = (emoji) => {
    client.publish('emojis/'+id, JSON.stringify({latestEmoji: {value: emoji, id: Math.random()}}), {qos: 1})
  }

  //const emojiToHex = (emoji) => emoji.codePointAt(0).toString(16)
  //const hexToEmoji = (hex) => String.fromCodePoint("0x"+hex)
 
  return (
    <div className="emoji-stack bg-light h5 p-1 rounded">
      {emojis.map(({value, id, style}) => <div key={id} style={style} className="emoji">{value}</div>)}
      {['💩','😠','😭','😂','😀','🥱','💔','💯','🍆'].map(el => <span key={el} onClick={() => handleEmojiClick(el)}>{el}</span>)}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    latestEmoji: state.game.latestEmoji,
    client: state.mqtt.client,
    id: state.game.id
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Emojis)

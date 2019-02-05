const Paho = require('./mqttws31.js')
const host = 'm15.cloudmqtt.com'
const port = 36592
const path = '/'
const topic = 'paho/test'
const clientId = Math.random().toString(36).substr(2, 10)

function sendMessage (text) {
  if (!(client && client.isConnected())) {
    return console.log('not connected')
  }
  var message = new Paho.MQTT.Message(text)
  message.destinationName = topic
  message.qos = 1
  message.retained = false
  client.send(message)
  console.log('send:      topic=' + topic + ' text=' + text)
}

function connect () {
  if (client && client.isConnected()) {
    return
  }
  client.connect({
    invocationContext: {foo: 'bar'},
    onSuccess: function onConnect (invocationContext) {
      console.log(`connected to: ${host}:${port}${path}`)
      client.subscribe(topic, {qos: 0})
    },
    onFailure: function onFailure (message) {
      console.log(`failed to connected: ${message.errorCode}\n${message.errorMessage}`)
      setTimeout(connect, 5000)
    },
	timeout:3,
	useSSL:true,
        userName: "brreombc",
        password: "JjCO0gVzkYpw",
        cleanSession:true,
	
  })
}

function sendHello () {
  sendMessage('hello world')
  setTimeout(sendHello, 3000)
}

//const client = new Paho.MQTT.Client(host, port, path, clientId)
const client = new Paho.MQTT.Client("m15.cloudmqtt.com", 36592,"aa" + parseInt(Math.random() * 100, 10));


client.onConnectionLost = function onConnectionLost (message) {
  const code = message.errorCode
  const text = message.errorMessage
  console.log(`ERROR: ${code} ${text}`)
  setTimeout(connect, 3000)
}

client.onMessageArrived = function onMessageArrived (message) {
  const topic = message.destinationName
  const text = message.payloadString
  console.log(`received:  topic=${topic} text=${text}`)
}

client.onMessageDelivered = function onMessageDelivered (message) {
  const topic = message.destinationName
  const text = message.payloadString
  console.log(`delivered: topic=${topic} text=${text}`)
}

connect()
sendHello()


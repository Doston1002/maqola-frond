import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Text,
  Input,
  IconButton,
  VStack,
  HStack,
  Avatar,
  Heading,
  useColorModeValue,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

export default function MentorPageComponent() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalomu alaykum, Savollaringiz bormi?\nJavob berishdan xursand bo\'lamiz!' }
  ]);
  const [loading, setLoading] = useState(false);

  // Scroll to bottom whenever messages change
const messagesEndRef = useRef<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, data.message]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Xat yuz berdi. Iltimos, qaytadan urinib ko\'ring.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Container maxW="container.md" h="100vh" p={0}>
      <Flex 
        direction="column" 
        h="100%" 
        bg={bgColor}
      >
        {/* Header */}
        <Box p={4} borderBottomWidth="1px" bg="white">
          <Flex align="center">
            <Avatar 
              size="md" 
              src="/mentor-avatar.png" 
              bg="blue.100"
             
            />
            <Box ml={3}>
              <Heading size="lg">Online mentor</Heading>
              <Text color="gray.500">Murojaatingizni kiriting!</Text>
            </Box>
          </Flex>
        </Box>
        
        {/* Chat Area */}
        <Box 
          flex="1" 
          overflowY="auto" 
          p={4}
          bg={bgColor}
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={message.role === 'user' ? 'blue.500' : cardBgColor}
                color={message.role === 'user' ? 'white' : 'black'}
                borderRadius="lg"
                p={3}
                maxW="80%"
                boxShadow="sm"
              >
                <Text>{message.content}</Text>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        
        {/* Input Area */}
        <Box p={4} borderTopWidth="1px" bg="white">
          <HStack>
            <InputGroup>
              <Input
                placeholder="Murojaatingizni kiriting"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="white"
                isDisabled={loading}
              />
              <InputRightElement>
                <IconButton
               
                  variant="ghost"
                  colorScheme="blue"
                  aria-label="Emoji"
                  mr={1}
                />
              </InputRightElement>
            </InputGroup>
            <IconButton
            
              colorScheme="blue"
              aria-label="Send message"
              onClick={handleSend}
              isLoading={loading}
            />
          </HStack>
        </Box>
      </Flex>
    </Container>
  );
}
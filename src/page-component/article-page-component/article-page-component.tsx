import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Textarea,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

import { API_URL } from 'src/config/api.config';

export default function ArticlePageComponent() {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Salom!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/openai/chatCompletion`, {
        messages: newMessages,
      });

      const aiMessage = res.data.choices[0].message.content;
      setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
      setResponse(aiMessage);
    } catch (error) {
      console.error(error);
      setResponse('Xatolik yuz berdi!');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Container py={10}>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Assalomu alaykum, Savollaringiz bormi? Javob berishdan xursand bo'lamiz!</Heading>

        <Box 	border={'1px solid facebook.500'}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              p={3}
              mb={2}
              bg={msg.role === 'user' ? '' : ''}
              borderRadius="md"
            >
              <Text fontWeight="bold">{msg.role === 'user' ? 'Siz' : 'Javob'}:</Text>
              <Text whiteSpace="pre-wrap">{msg.content}</Text>
            </Box>
          ))}
        </Box>

        <Textarea
          placeholder="Savolingizni yozing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />

        <Button colorScheme="blue" onClick={handleSend} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Yuborish'}
        </Button>
      </VStack>
    </Container>
  );
}

import { Box, Button, Card, CardBody, Input, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ONEID_URL } from 'src/config/api.config';
import SectionTitle from '../section-title/section-title';

const Newsletter = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!email.trim()) {
      setError(t('newsletter_error_empty', { ns: 'home' }) as string);
      return;
    }

    if (!isValidEmail(email)) {
      setError(t('newsletter_error_invalid', { ns: 'home' }) || 'Email noto\'g\'ri formatda');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ONEID_URL}api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Obuna bo\'lishda xato yuz berdi');
        return;
      }

      // Muvaffaqiyatli obuna
      toast({
        title: 'Obunaga rahmat!',
        description: 'Yangiliklarga obuna bo\'ldingiz.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      setEmail('');
      setError('');

    } catch (error) {
      console.error('Newsletter error:', error);
      setError('Tarmoq xatosi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <Card mt={10}>
      <CardBody minH={'50vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Stack spacing={3}>
          <SectionTitle
            textAlign={'center'}
            maxW={'container.sm'}
            title={t('newsletter_title', { ns: 'home' })}
            subtitle={t('newsletter_description', { ns: 'home' })}
          />
          <Box pos={'relative'}>
            <Input
              h={14}
              w={'full'}
              bg={useColorModeValue('white','gray.900')}
              color={useColorModeValue('gray.900', 'white')}
              placeholder={t('newsletter_placeholder', { ns: 'home' }) || ''}
              _placeholder={{ color: 'gray.500' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              borderColor={error ? 'red.500' : 'gray.200'}
              disabled={loading}
            />
            <Button
              pos={'absolute'}
              right={2}
              top={2}
              colorScheme={'gray'}
              zIndex={999}
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Yuborilmoqda..."
            >
              {t('newsletter_submit', { ns: 'home' })}
            </Button>
            {error && <Text color="red.500" mt={1}>{error}</Text>}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Newsletter;
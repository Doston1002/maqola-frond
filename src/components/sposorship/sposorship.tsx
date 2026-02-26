// startup-client/src/components/sposorship/sposorship.tsx
import { Box, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-multi-carousel';
import { sponsorshipCarousel } from 'src/config/carousel';
import { trustedCompeny } from 'src/config/constants';
import SectionTitle from '../section-title/section-title';

const Sposorship = () => {
  const { t } = useTranslation();

  return (
    <>
      <SectionTitle title='' subtitle={t('sponsor_title', { ns: 'home' })} textAlign={'center'} mb={5} />
      <Carousel responsive={sponsorshipCarousel} arrows={false} showDots={false} infinite autoPlay={true} autoPlaySpeed={1000}>
        {trustedCompeny.map((item, idx) => (
          <Box key={idx} textAlign="center">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Image src={item.logo} alt={item.name} boxSize="60px" mx="auto" mb={2} />
            </a>
            <Text fontSize="md" fontWeight="bold">{item.name}</Text>
          </Box>
        ))}
      </Carousel>
    </>
  );
};

export default Sposorship;
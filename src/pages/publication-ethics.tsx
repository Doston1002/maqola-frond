import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';

const PublicationEthicsPage = () => (
	<Seo metaTitle="Nashr etika" metaDescription="Nashr etika qoidalari">
		<Container maxW="container.md" py={10}>
			<Heading size="lg" mb={6}>Nashr etika</Heading>
			<Box>
				<Text>Bu sahifada ilmiy nashr etika talablari va qoidalari joylashtiriladi.</Text>
			</Box>
		</Container>
	</Seo>
);

export default withLayout(PublicationEthicsPage);

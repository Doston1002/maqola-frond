import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';

const EditorialBoardPage = () => (
	<Seo metaTitle="Tahririyat kengashi" metaDescription="Journal tahririyat kengashi">
		<Container maxW="container.md" py={10}>
			<Heading size="lg" mb={6}>Tahririyat kengashi</Heading>
			<Box>
				<Text>Bu sahifada journal tahririyat kengashi aʼzolari haqida maʼlumot joylashtiriladi.</Text>
			</Box>
		</Container>
	</Seo>
);

export default withLayout(EditorialBoardPage);

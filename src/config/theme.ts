import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
	initialColorMode: 'system',
	useSystemColorMode: true,
};

export const theme = extendTheme({
	config,
	fonts: {
		heading: "'Roboto', sans-serif",
		body: "'Roboto', sans-serif",
	},
	styles: {
		global: (props) => ({
			body: {
				bg: mode('white', 'gray.900')(props),
				color: mode('gray.800', 'gray.200')(props),
			},
		}),
	},
});

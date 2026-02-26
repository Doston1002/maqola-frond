export const loadImage = (imageURL?: string) => {
	if (!imageURL) return '';
	
	// Agar URL allaqachon to'liq bo'lsa (http yoki https bilan boshlansa)
	if (imageURL.startsWith('http://') || imageURL.startsWith('https://')) {
		return imageURL;
	}
	
	const baseURL = process.env.NEXT_PUBLIC_API_SERVICE || 'https://api.uydatalim.uzedu.uz';
	
	// Agar imageURL / bilan boshlanmasa, qo'shish
	const formattedURL = imageURL.startsWith('/') ? imageURL : `/${imageURL}`;
	
	return `${baseURL}${formattedURL}`;
};

// Reyting raqamini bitta o'nlik raqamgacha qisqartirish
export const formatRating = (rating: number | undefined): string => {
	if (rating === undefined || rating === null) return '0';
	return Number(rating).toFixed(1);
};
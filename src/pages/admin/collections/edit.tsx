import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Switch, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withAdminLayout } from 'src/layouts/admin';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { AdminCollectionService } from 'src/services/admin-collection.service';
import { getFileUrl, getAssetSrc, getCollectionsUrl } from 'src/config/api.config';
import $axios from 'src/api/axios';

const EditCollectionPage = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const toast = useToast();
	const userRole = getRoleFromToken();
	const [title_uz, setTitleUz] = useState('');
	const [title_ru, setTitleRu] = useState('');
	const [title_en, setTitleEn] = useState('');
	const [description_uz, setDescriptionUz] = useState('');
	const [description_ru, setDescriptionRu] = useState('');
	const [description_en, setDescriptionEn] = useState('');
	const [year, setYear] = useState(new Date().getFullYear());
	const [coverImage, setCoverImage] = useState('');
	const [isPublished, setIsPublished] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (userRole !== 'ADMIN') router.push('/');
	}, [userRole, router]);

	useEffect(() => {
		if (!id || userRole !== 'ADMIN') return;
		$axios.get(getCollectionsUrl('admin/' + id)).then((res) => {
			const c = res.data;
			setTitleUz(c.title_uz ?? c.title ?? '');
			setTitleRu(c.title_ru ?? '');
			setTitleEn(c.title_en ?? '');
			setDescriptionUz(c.description_uz ?? c.description ?? '');
			setDescriptionRu(c.description_ru ?? '');
			setDescriptionEn(c.description_en ?? '');
			setYear(c.year);
			setCoverImage(c.coverImage || '');
			setIsPublished(!!c.isPublished);
		}).catch(() => toast({ title: 'Topilmadi', status: 'error' })).finally(() => setLoading(false));
	}, [id, userRole, toast]);

	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const form = new FormData();
		form.append('image', file);
		try {
			const { data } = await $axios.post<{ url: string }>(`${getFileUrl('save')}?folder=covers`, form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setCoverImage(data.url);
		} catch {
			toast({ title: 'Rasm yuklash xatolik', status: 'error' });
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await AdminCollectionService.update(id, {
				title: title_uz || title_ru || title_en || undefined,
				title_uz: title_uz || undefined,
				title_ru: title_ru || undefined,
				title_en: title_en || undefined,
				description: description_uz || description_ru || description_en || undefined,
				description_uz: description_uz || undefined,
				description_ru: description_ru || undefined,
				description_en: description_en || undefined,
				year,
				coverImage: coverImage || undefined,
				isPublished,
			});
			toast({ title: "Saqlandi", status: 'success' });
			router.push('/admin/collections');
		} catch {
			toast({ title: 'Xatolik', status: 'error' });
		} finally {
			setSubmitting(false);
		}
	};

	if (userRole !== 'ADMIN') return null;
	if (loading) return <Box py={10}>Yuklanmoqda...</Box>;

	return (
		<Box py={10}>
			<Box as="form" onSubmit={onSubmit} maxW="md">
				<FormControl mb={4}>
					<FormLabel>Nomi (o&apos;zbekcha)</FormLabel>
					<Input value={title_uz} onChange={(e) => setTitleUz(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Nomi (ruscha)</FormLabel>
					<Input value={title_ru} onChange={(e) => setTitleRu(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Nomi (inglizcha)</FormLabel>
					<Input value={title_en} onChange={(e) => setTitleEn(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Tavsif (o&apos;zbekcha)</FormLabel>
					<Input value={description_uz} onChange={(e) => setDescriptionUz(e.target.value)} as="textarea" rows={2} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Tavsif (ruscha)</FormLabel>
					<Input value={description_ru} onChange={(e) => setDescriptionRu(e.target.value)} as="textarea" rows={2} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Tavsif (inglizcha)</FormLabel>
					<Input value={description_en} onChange={(e) => setDescriptionEn(e.target.value)} as="textarea" rows={2} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Yil</FormLabel>
					<Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10) || 0)} required />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Muqova rasm</FormLabel>
					<Input type="file" accept="image/*" onChange={handleFile} />
					{coverImage && <Box as="img" src={getAssetSrc(coverImage)} alt="" mt={2} maxH="120px" />}
				</FormControl>
				<FormControl mb={4} display="flex" alignItems="center">
					<FormLabel mb={0}>Nashr etilgan</FormLabel>
					<Switch isChecked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
				</FormControl>
				<Button type="submit" colorScheme="blue" isLoading={submitting}>Saqlash</Button>
			</Box>
		</Box>
	);
};

export default withAdminLayout(EditCollectionPage);

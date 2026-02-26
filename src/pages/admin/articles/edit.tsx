import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Switch, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withAdminLayout } from 'src/layouts/admin';
import { getRoleFromToken } from 'src/helpers/token.helper';
import { AdminArticleService } from 'src/services/admin-article.service';
import { AdminCollectionService } from 'src/services/admin-collection.service';
import { getFileUrl, API_URL } from 'src/config/api.config';
import $axios from 'src/api/axios';
import { CollectionType } from 'src/interfaces/collection.interface';
import { RichTextEditor } from 'src/components/rich-text-editor/rich-text-editor';

const EditArticlePage = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const toast = useToast();
	const userRole = getRoleFromToken();
	const [collections, setCollections] = useState<CollectionType[]>([]);
	const [collectionId, setCollectionId] = useState('');
	const [title_uz, setTitleUz] = useState('');
	const [title_ru, setTitleRu] = useState('');
	const [title_en, setTitleEn] = useState('');
	const [authors, setAuthors] = useState('');
	const [abstract_uz, setAbstractUz] = useState('');
	const [abstract_ru, setAbstractRu] = useState('');
	const [abstract_en, setAbstractEn] = useState('');
	const [keywords_uz, setKeywordsUz] = useState('');
	const [keywords_ru, setKeywordsRu] = useState('');
	const [keywords_en, setKeywordsEn] = useState('');
	const [pdfUrl, setPdfUrl] = useState('');
	const [doi, setDoi] = useState('');
	const [isPublished, setIsPublished] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (userRole !== 'ADMIN') router.push('/');
		else AdminCollectionService.getAll().then(setCollections);
	}, [userRole, router]);

	useEffect(() => {
		if (!id || userRole !== 'ADMIN') return;
		$axios.get(`${API_URL}/articles/admin/${id}`).then((res) => {
			const a = res.data;
			setCollectionId(typeof a.collectionId === 'object' ? (a.collectionId as any)?._id : a.collectionId || '');
			setTitleUz(a.title_uz ?? a.title ?? '');
			setTitleRu(a.title_ru ?? '');
			setTitleEn(a.title_en ?? '');
			setAuthors(a.authors || '');
			setAbstractUz(a.abstract_uz ?? a.abstract ?? '');
			setAbstractRu(a.abstract_ru ?? '');
			setAbstractEn(a.abstract_en ?? '');
			setKeywordsUz(a.keywords_uz ?? (Array.isArray(a.keywords) ? a.keywords.join(', ') : ''));
			setKeywordsRu(a.keywords_ru ?? '');
			setKeywordsEn(a.keywords_en ?? '');
			setPdfUrl(a.pdfUrl || '');
			setDoi(a.doi || '');
			setIsPublished(!!a.isPublished);
		}).catch(() => toast({ title: 'Topilmadi', status: 'error' })).finally(() => setLoading(false));
	}, [id, userRole, toast]);

	const handlePdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const form = new FormData();
		form.append('pdf', file);
		try {
			const { data } = await $axios.post<{ url: string }>(`${API_URL}${getFileUrl('save-pdf')}?folder=articles`, form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setPdfUrl(data.url);
			toast({ title: 'PDF yuklandi', status: 'success' });
		} catch {
			toast({ title: 'PDF yuklash xatolik', status: 'error' });
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const title = title_uz || title_ru || title_en;
		setSubmitting(true);
		try {
			await AdminArticleService.update(id, {
				collectionId: collectionId || undefined,
				title: title || undefined,
				title_uz: title_uz || undefined,
				title_ru: title_ru || undefined,
				title_en: title_en || undefined,
				authors: authors || undefined,
				abstract: abstract_uz || abstract_ru || abstract_en || undefined,
				abstract_uz: abstract_uz || undefined,
				abstract_ru: abstract_ru || undefined,
				abstract_en: abstract_en || undefined,
				keywords: keywords_uz ? keywords_uz.split(',').map((k) => k.trim()).filter(Boolean) : undefined,
				keywords_uz: keywords_uz || undefined,
				keywords_ru: keywords_ru || undefined,
				keywords_en: keywords_en || undefined,
				pdfUrl: pdfUrl || undefined,
				doi: doi || undefined,
				isPublished,
			});
			toast({ title: 'Saqlandi', status: 'success' });
			router.push('/admin/articles');
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
					<FormLabel>Journal to&apos;plami</FormLabel>
					<Select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} required>
						<option value="">Tanlang</option>
						{collections.map((c) => (
							<option key={c._id} value={c._id}>{c.title}</option>
						))}
					</Select>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Sarlavha (o&apos;zbekcha)</FormLabel>
					<Input value={title_uz} onChange={(e) => setTitleUz(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Sarlavha (ruscha)</FormLabel>
					<Input value={title_ru} onChange={(e) => setTitleRu(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Sarlavha (inglizcha)</FormLabel>
					<Input value={title_en} onChange={(e) => setTitleEn(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Muallif(lar)</FormLabel>
					<Input value={authors} onChange={(e) => setAuthors(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Annotatsiya (o&apos;zbekcha)</FormLabel>
					<RichTextEditor value={abstract_uz} onChange={setAbstractUz} placeholder="Annotatsiya (o'zbekcha)..." />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Annotatsiya (ruscha)</FormLabel>
					<RichTextEditor value={abstract_ru} onChange={setAbstractRu} placeholder="Аннотация (рус)..." />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Annotatsiya (inglizcha)</FormLabel>
					<RichTextEditor value={abstract_en} onChange={setAbstractEn} placeholder="Abstract (English)..." />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Kalit so&apos;zlar — o&apos;zbekcha</FormLabel>
					<Input value={keywords_uz} onChange={(e) => setKeywordsUz(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Kalit so&apos;zlar — ruscha</FormLabel>
					<Input value={keywords_ru} onChange={(e) => setKeywordsRu(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Kalit so&apos;zlar — inglizcha</FormLabel>
					<Input value={keywords_en} onChange={(e) => setKeywordsEn(e.target.value)} />
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>PDF fayl (yangilash ixtiyoriy)</FormLabel>
					<Input type="file" accept=".pdf" onChange={handlePdf} />
					{pdfUrl && <Box mt={2} fontSize="sm" color="green.600">Hozirgi: {pdfUrl}</Box>}
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>DOI</FormLabel>
					<Input value={doi} onChange={(e) => setDoi(e.target.value)} />
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

export default withAdminLayout(EditArticlePage);

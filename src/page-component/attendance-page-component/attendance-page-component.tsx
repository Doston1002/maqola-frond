import { 
  Button, 
  Card, 
  CardBody, 
  Checkbox, 
  Flex, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Radio, 
  RadioGroup, 
  Select, 
  Stack, 
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactService } from 'src/services/contact.service';

const AttendancePageComponent = () => {
  const { t } = useTranslation();
  const toast = useToast();

  // Regions data
  const regions = [
    { id: 1, name: "Qoraqalpog'iston Respublikasi" },
    { id: 2, name: "Andijon viloyati" },
    { id: 3, name: "Buxoro viloyati" },
    { id: 4, name: "Jizzax viloyati" },
    { id: 5, name: "Qashqadaryo viloyati" },
    { id: 6, name: "Navoiy viloyati" },
    { id: 7, name: "Namangan viloyati" },
    { id: 8, name: "Samarqand viloyati" },
    { id: 9, name: "Surxondaryo viloyati" },
    { id: 10, name: "Sirdaryo viloyati" },
    { id: 11, name: "Toshkent viloyati" },
    { id: 12, name: "Farg'ona viloyati" },
    { id: 13, name: "Xorazm viloyati" },
    { id: 14, name: "Toshkent shahri" },
  ];

  // Sample districts data
  const districtsData = {
    1: [
      "Nukus shahar", "Amudaryo tumani", "Beruniy tumani", "Bo‘zatov tumani",
      "Chimboy tumani", "Ellikqal’a tumani", "Kegeyli tumani", "Mo‘ynoq tumani",
      "Nukus tumani", "Qonliko‘l tumani", "Qo‘ng‘irot tumani", "Qorao‘zak tumani",
      "Shumanay tumani", "Taxtako‘pir tumani", "Taqiyatosh tumani", "To‘rtko‘l tumani",
      "Xo‘jayli tumani"
    ],
    2: [
      "Andijon shahar", "Xonobod shahar", "Andijon tumani", "Asaka tumani", "Baliqchi tumani",
      "Buloqboshi tumani", "Bo‘ston tumani", "Jalaquduq tumani", "Izboskan tumani",
      "Qo‘rg‘ontepa tumani", "Marhamat tumani", "Oltinko‘l tumani", "Paxtaobod tumani",
      "Ulug‘nor tumani", "Xo‘jaobod tumani", "Shahrixon tumani"
    ],
    3: [
      "Buxoro shahar", "Kogon shahar", "Buxoro tumani", "Vobkent tumani", "G‘ijduvon tumani",
      "Jondor tumani", "Kogon tumani", "Qorako‘l tumani", "Qorovulbozor tumani",
      "Olot tumani", "Peshku tumani", "Romitan tumani", "Shofirkon tumani"
    ],
    4: [
      "Jizzax shahar", "Arnasoy tumani", "Baxmal tumani", "G‘allaorol tumani", "Do‘stlik tumani",
      "Zarbdor tumani", "Zafarobod tumani", "Zomin tumani", "Mirzacho‘l tumani",
      "Paxtakor tumani", "Forish tumani", "Sharof Rashidov tumani", "Yangiobod tumani"
    ],
    5: [
      "Qarshi shahar", "Shahrisabz shahar", "G‘uzor tumani", "Dehqonobod tumani", "Kasbi tumani",
      "Kitob tumani", "Koson tumani", "Ko‘kdala tumani", "Qamashi tumani", "Qarshi tumani",
      "Mirishkor tumani", "Muborak tumani", "Nishon tumani", "Chiroqchi tumani",
      "Shahrisabz tumani", "Yakkabog‘ tumani"
    ],
    6: [
      "Navoiy shahar", "Zarafshon shahar", "G‘ozg‘on shahar", "Karmana tumani", "Konimex tumani",
      "Qiziltepa tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani",
      "Uchquduq tumani", "Xatirchi tumani"
    ],
    7: [
      "Namangan shahar", "Davlatobod tumani", "Yangi Namangan tumani", "Kosonsoy tumani",
      "Mingbuloq tumani", "Namangan tumani", "Norin tumani", "Pop tumani",
      "To‘raqo‘rg‘on tumani", "Uychi tumani", "Uchqo‘rg‘on tumani", "Chortoq tumani",
      "Chust tumani", "Yangiqo‘rg‘on tumani"
    ],
    8: [
      "Samarqand shahar", "Kattaqo‘rg‘on shahar", "Bulung‘ur tumani", "Jomboy tumani",
      "Ishtixon tumani", "Kattaqo‘rg‘on tumani", "Qo‘shrabot tumani", "Narpay tumani",
      "Nurobod tumani", "Oqdaryo tumani", "Payariq tumani", "Pastdarg‘om tumani",
      "Paxtachi tumani", "Samarqand tumani", "Toyloq tumani", "Urgut tumani"
    ],
    9: [
      "Termiz shahar", "Angor tumani", "Bandixon tumani", "Boysun tumani", "Denov tumani",
      "Jarqo‘rg‘on tumani", "Qiziriq tumani", "Qumqo‘rg‘on tumani", "Muzrabot tumani",
      "Oltinsoy tumani", "Sariosiyo tumani", "Termiz tumani", "Uzun tumani",
      "Sherobod tumani", "Sho‘rchi tumani"
    ],
    10: [
      "Guliston shahar", "Shirin shahar", "Yangiyer shahar", "Boyovut tumani", "Guliston tumani",
      "Mirzaobod tumani", "Oqoltin tumani", "Sayxunobod tumani", "Sardoba tumani",
      "Sirdaryo tumani", "Xovos tumani"
    ],
    11: [
      "Nurafshon shahar", "Olmaliq shahar", "Angren shahar", "Bekobod shahar", "Ohangaron shahar",
      "Chirchiq shahar", "Yangiyo‘l shahar", "Bekobod tumani", "Bo‘ka tumani", "Bo‘stonliq tumani",
      "Zangiota tumani", "Qibray tumani", "Quyichirchiq tumani", "Oqqo‘rg‘on tumani",
      "Ohangaron tumani", "Parkent tumani", "Piskent tumani", "Toshkent tumani",
      "O‘rtachirchiq tumani", "Chinoz tumani", "Yuqorichirchiq tumani", "Yangiyo‘l tumani"
    ],
    12: [
      "Farg‘ona shahar", "Marg‘ilon shahar", "Quvasoy shahar", "Qo‘qon shahar", "Bag‘dod tumani",
      "Beshariq tumani", "Buvayda tumani", "Dang‘ara tumani", "Yozyovon tumani",
      "Oltiariq tumani", "Qo‘shtepa tumani", "Rishton tumani", "So‘x tumani", "Toshloq tumani",
      "Uchko‘prik tumani", "Farg‘ona tumani", "Furqat tumani", "O‘zbekiston tumani",
      "Quva tumani"
    ],
    13: [
      "Urganch shahar", "Xiva shahar", "Bog‘ot tumani", "Gurlan tumani", "Qo‘shko‘pir tumani",
      "Tuproqqal’a tumani", "Urganch tumani", "Hazorasp tumani", "Xiva tumani",
      "Xonqa tumani", "Shovot tumani", "Yangiariq tumani", "Yangibozor tumani"
    ],
    14: [
      "Bektemir tumani", "Mirzo Ulug‘bek tumani", "Mirobod tumani", "Olmazor tumani",
      "Sergeli tumani", "Uchtepa tumani", "Chilonzor tumani", "Shayxontohur tumani",
      "Yunusobod tumani", "Yakkasaroy tumani", "Yangi Hayot tumani", "Yashnobod tumani"
    ],
  };

  // Sample schools data
  const schoolsData = {
    "Nukus shahar":[
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab",
  "8-maktab", "9-maktab", "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab",
  "15-maktab", "16-maktab", "17-maktab", "18-maktab", "19-maktab", "20-maktab", "21-maktab",
  "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab", "28-maktab",
  "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab", "35-maktab",
  "36-maktab", "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab",
  "43-maktab", "44-maktab", "45-maktab", "46-maktab", "47-maktab", "48-maktab", "49-maktab",
  "50-maktab", "51-maktab", "52-maktab", "53-maktab", "54-maktab"
],
  "Amudaryo tumani": [
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab", "8-maktab", "9-maktab",
  "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab", "15-maktab", "16-IDUM", "17-maktab", "18-maktab",
  "19-maktab", "20-maktab", "21-maktab", "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab",
  "28-maktab", "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab", "35-maktab", "36-maktab",
  "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab", "43-maktab", "44-maktab", "45-maktab",
  "46-maktab", "47-maktab", "48-maktab", "49-maktab", "50-maktab", "51-maktab", "52-maktab", "53-maktab", "54-maktab",
  "55-maktab", "56-maktab", "57-maktab", "58-maktab", "59-maktab", "60-maktab", "61-maktab", "62-maktab", "63-maktab",
  "64-maktab", "65-maktab", "66-maktab", "67-maktab", "68-maktab", "69-maktab", "70-maktab", "71-maktab", "72-maktab",
  "73-maktab", "74-maktab", "75-maktab", "76-maktab", "77-maktab", "78-maktab", "79-maktab", "80-maktab", 
  "82-maktab", "83-maktab", "84-maktab", "85-maktab", "86-maktab", "8-IDUM"
],
  "Beruniy tumani": [
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab", "8-maktab", "9-maktab",
  "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab", "15-maktab", "16-maktab", "17-maktab", "18-maktab",
  "19-maktab", "20-maktab", "21-maktab", "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab",
  "28-maktab", "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab",
  "36-maktab", "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab", "43-maktab",
  "44-maktab", "45-maktab", "46-maktab", "47-maktab", "48-maktab", "49-maktab", "50-maktab", "51-maktab",
  "52-maktab", "53-maktab", "54-maktab", "55-maktab", "56-maktab", "57-maktab", "58-maktab", "59-maktab",
  "60-maktab", "61-maktab", "62-maktab", "63-maktab", "64-maktab", "65-maktab", "66-maktab", "67-maktab",
  "68-maktab", "69-maktab", "70-maktab", "71-maktab", "72-maktab"
],

    // Add schools for other districts similarly
  };

  // School classes data
  const schoolClasses = [
    { id: 1, name: "1-sinf" },
    { id: 2, name: "2-sinf" },
    { id: 3, name: "3-sinf" },
    { id: 4, name: "4-sinf" },
    { id: 5, name: "5-sinf" },
    { id: 6, name: "6-sinf" },
    { id: 7, name: "7-sinf" },
    { id: 8, name: "8-sinf" },
    { id: 9, name: "9-sinf" },
    { id: 10, name: "10-sinf" },
    { id: 11, name: "11-sinf" },
    { id: 12, name: "Badiiy kitoblar" }
  ];

  // Subjects data by class
  const subjectsByClass = {
  "1-sinf": [
  "Ona tili va adabiyot",
  "Chet tili",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "2-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "3-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "4-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "5-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "6-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "7-sinf":  [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik"
],
    "8-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "9-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "10-sinf":  [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Tarbiya",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Texnologiya"
],
    "11-sinf":[
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Tarbiya",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Texnologiya"
],
  };

  // Form state
  const [formData, setFormData] = useState({ 
    fullName: '',
    teacherName: '', 
    message: '',
    isAbsent: false,
    teachingMethod: '',
    region: '',
    district: '',
    school: '',
    schoolClass: '',
    subject: ''
  });

  const [districts, setDistricts] = useState([]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Handle region change
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setFormData(prev => ({ ...prev, region: regionId, district: '', school: '' }));
    setDistricts(districtsData[regionId] || []);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData(prev => ({ ...prev, district: districtName, school: '' }));
  };

  // Handle radio group change
  const handleTeachingMethodChange = (value) => {
    setFormData((prev) => ({ ...prev, teachingMethod: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { 
      fullName, 
      teacherName,
      isAbsent, 
      teachingMethod,
      region,
      district,
      school,
      schoolClass,
      subject
    } = formData;

    if (!fullName || !teacherName || !region || !district || !school || !schoolClass || !subject) {
      toast({
        title: t('Ma\'lumotlarni to\'liq to\'ldiring', { ns: 'global' }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Send to backend only
      await ContactService.sendMessage({
        fullName,
        teacherName,
        region: regions.find(r => r.id.toString() === region)?.name || region,
        district,
        school,
        schoolClass,
        subject,
        teachingMethod,
        isAbsent,
        type: 'attendance'
      });

      toast({
        title: t('yuborgan ma\'lumotlaringiz uchun raxmat', { ns: 'global' }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setFormData({ 
        fullName: '', 
        teacherName: '', 
        message: '',
        isAbsent: false,
        teachingMethod: '',
        region: '',
        district: '',
        school: '',
        schoolClass: '',
        subject: ''
      });
      setDistricts([]);
    } catch (error) {
      console.error(error);
      toast({
        title: t('contact_error', { ns: 'global' }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h={'auto'} minH={'90vh'} justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
      <Card w={{ base: '100%', lg: '100%' }}>
        <CardBody>
          <Heading fontSize={'2xl'}>{t('contact_heading', { ns: 'global' })}</Heading>
          <Text fontSize={'lg'} mt={4}>
            {t('contact_text', { ns: 'global' })}
          </Text>
          <Stack spacing={4} mt={5}>
            {/* Personal Information */}
            <Flex justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
              <FormControl isRequired>
                <FormLabel>{t('full_name', { ns: 'global' })}</FormLabel>
                <Input
                  name="fullName"
                  type="text"
                  placeholder="Ismingizni kiriting"
                  h={14}
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('teacher_name', { ns: 'global' })}</FormLabel>
                <Input
                  name="teacherName"
                  type="text"
                  placeholder="O'qituvchini ismini kiriting"
                  h={14}
                  value={formData.teacherName}
                  onChange={handleChange}
                />
              </FormControl>
            </Flex>

            {/* Region, District, School Selection */}
            <FormControl isRequired>
              <FormLabel>{t('region', { ns: 'global' })}</FormLabel>
              <Select 
                placeholder='Tanlang'
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('district', { ns: 'global' })}</FormLabel>
              <Select 
                placeholder='Tanlang'
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                isDisabled={!formData.region}
              >
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('school', { ns: 'global' })}</FormLabel>
              <Input
                placeholder="Maktabingizni kiriting"
                name="school"
                type="text"
                h={14}
                value={formData.school}
                onChange={handleChange}
              />
            </FormControl>

            {/* School Class and Subject Selection */}
            <Flex justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
              <FormControl isRequired>
                <FormLabel>{t('school_class', { ns: 'global' })}</FormLabel>
                <Input
                  placeholder="Sinfingizni kiriting"
                  name="schoolClass"
                  type="text"
                  h={14}
                  value={formData.schoolClass}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('subject', { ns: 'global' })}</FormLabel>
                <Input
                  placeholder="Fanni kiriting"
                  name="subject"
                  type="text"
                  h={14}
                  value={formData.subject}
                  onChange={handleChange}
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>{t('teaching_method', { ns: 'global' })}</FormLabel>
              <RadioGroup 
                onChange={handleTeachingMethodChange} 
                value={formData.teachingMethod}
              >
                <Stack direction="row">
                  <Radio value="Alo">{t('excellent', { ns: 'global' })}</Radio>
                  <Radio value="O'rta">{t('average', { ns: 'global' })}</Radio>
                  <Radio value="Qoniqarsiz">{t('unsatisfactory', { ns: 'global' })}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Attendance and Teaching Method */}
            <FormControl>
              <Checkbox
                name="isAbsent"
                isChecked={formData.isAbsent}
                onChange={handleChange}
                colorScheme="red"
              >
                {t('teacher_absent', { ns: 'global' })}
              </Checkbox>
            </FormControl>

            <Button w={'full'} h={14} colorScheme={'gray'} onClick={handleSubmit}>
              {t('contact_btn', { ns: 'global' })}
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default AttendancePageComponent;
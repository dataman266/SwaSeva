export interface District { id: string; name: string; nameMr: string }
export interface Taluka  { id: string; name: string; nameMr: string; districtId: string }

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman & Nicobar Islands','Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Jammu & Kashmir','Ladakh',
  'Lakshadweep','Puducherry',
];

export const MAHARASHTRA_DISTRICTS: District[] = [
  { id: 'ahmednagar',      name: 'Ahmednagar',                   nameMr: 'अहमदनगर'           },
  { id: 'akola',           name: 'Akola',                        nameMr: 'अकोला'              },
  { id: 'amravati',        name: 'Amravati',                     nameMr: 'अमरावती'            },
  { id: 'aurangabad',      name: 'Chhatrapati Sambhajinagar',    nameMr: 'छत्रपती संभाजीनगर' },
  { id: 'beed',            name: 'Beed',                         nameMr: 'बीड'                },
  { id: 'bhandara',        name: 'Bhandara',                     nameMr: 'भंडारा'             },
  { id: 'buldhana',        name: 'Buldhana',                     nameMr: 'बुलढाणा'            },
  { id: 'chandrapur',      name: 'Chandrapur',                   nameMr: 'चंद्रपूर'           },
  { id: 'dhule',           name: 'Dhule',                        nameMr: 'धुळे'               },
  { id: 'gadchiroli',      name: 'Gadchiroli',                   nameMr: 'गडचिरोली'           },
  { id: 'gondia',          name: 'Gondia',                       nameMr: 'गोंदिया'            },
  { id: 'hingoli',         name: 'Hingoli',                      nameMr: 'हिंगोली'            },
  { id: 'jalgaon',         name: 'Jalgaon',                      nameMr: 'जळगाव'              },
  { id: 'jalna',           name: 'Jalna',                        nameMr: 'जालना'              },
  { id: 'kolhapur',        name: 'Kolhapur',                     nameMr: 'कोल्हापूर'          },
  { id: 'latur',           name: 'Latur',                        nameMr: 'लातूर'              },
  { id: 'mumbai-city',     name: 'Mumbai City',                  nameMr: 'मुंबई शहर'          },
  { id: 'mumbai-suburban', name: 'Mumbai Suburban',              nameMr: 'मुंबई उपनगर'        },
  { id: 'nagpur',          name: 'Nagpur',                       nameMr: 'नागपूर'             },
  { id: 'nanded',          name: 'Nanded',                       nameMr: 'नांदेड'             },
  { id: 'nandurbar',       name: 'Nandurbar',                    nameMr: 'नंदुरबार'           },
  { id: 'nashik',          name: 'Nashik',                       nameMr: 'नाशिक'              },
  { id: 'osmanabad',       name: 'Dharashiv',                    nameMr: 'धाराशिव'            },
  { id: 'palghar',         name: 'Palghar',                      nameMr: 'पालघर'              },
  { id: 'parbhani',        name: 'Parbhani',                     nameMr: 'परभणी'              },
  { id: 'pune',            name: 'Pune',                         nameMr: 'पुणे'               },
  { id: 'raigad',          name: 'Raigad',                       nameMr: 'रायगड'              },
  { id: 'ratnagiri',       name: 'Ratnagiri',                    nameMr: 'रत्नागिरी'          },
  { id: 'sangli',          name: 'Sangli',                       nameMr: 'सांगली'             },
  { id: 'satara',          name: 'Satara',                       nameMr: 'सातारा'             },
  { id: 'sindhudurg',      name: 'Sindhudurg',                   nameMr: 'सिंधुदुर्ग'         },
  { id: 'solapur',         name: 'Solapur',                      nameMr: 'सोलापूर'            },
  { id: 'thane',           name: 'Thane',                        nameMr: 'ठाणे'               },
  { id: 'wardha',          name: 'Wardha',                       nameMr: 'वर्धा'              },
  { id: 'washim',          name: 'Washim',                       nameMr: 'वाशिम'              },
  { id: 'yavatmal',        name: 'Yavatmal',                     nameMr: 'यवतमाळ'             },
];

export const MAHARASHTRA_TALUKAS: Taluka[] = [
  // Ahmednagar
  ...[['ahmednagar-t','Ahmednagar','अहमदनगर'],['sangamner','Sangamner','संगमनेर'],['kopargaon','Kopargaon','कोपरगाव'],['shrirampur','Shrirampur','श्रीरामपूर'],['nevasa','Nevasa','नेवासा'],['shevgaon','Shevgaon','शेवगाव'],['pathardi','Pathardi','पाथर्डी'],['parner','Parner','पारनेर'],['karjat-a','Karjat','कर्जत'],['jamkhed','Jamkhed','जामखेड'],['rahuri','Rahuri','राहुरी'],['rahata','Rahata','राहाता']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'ahmednagar'})),
  // Akola
  ...[['akola-t','Akola','अकोला'],['akot','Akot','अकोट'],['telhara','Telhara','तेल्हारा'],['balapur','Balapur','बाळापूर'],['patur','Patur','पातूर'],['murtizapur','Murtizapur','मूर्तिजापूर'],['barshitakli','Barshitakli','बार्शीटाकळी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'akola'})),
  // Amravati
  ...[['amravati-t','Amravati','अमरावती'],['achalpur','Achalpur','अचलपूर'],['chandur-bazar','Chandur Bazar','चांदूर बाजार'],['daryapur','Daryapur','दर्यापूर'],['dharni','Dharni','धारणी'],['morshi','Morshi','मोर्शी'],['nandgaon-k','Nandgaon Khandeshwar','नांदगाव खंडेश्वर'],['tiosa','Tiosa','तिवसा'],['warud','Warud','वरूड']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'amravati'})),
  // Aurangabad (CSN)
  ...[['aurangabad-t','Chhatrapati Sambhajinagar','छत्रपती संभाजीनगर'],['kannad','Kannad','कन्नड'],['khuldabad','Khuldabad','खुलताबाद'],['gangapur','Gangapur','गंगापूर'],['paithan','Paithan','पैठण'],['phulambri','Phulambri','फुलंब्री'],['sillod','Sillod','सिल्लोड'],['soegaon','Soegaon','सोयगाव'],['vaijapur','Vaijapur','वैजापूर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'aurangabad'})),
  // Beed
  ...[['beed-t','Beed','बीड'],['ambajogai','Ambajogai','अंबाजोगाई'],['ashti','Ashti','आष्टी'],['georai','Georai','गेवराई'],['kaij','Kaij','केज'],['majalgaon','Majalgaon','माजलगाव'],['parli','Parli','परळी'],['patoda','Patoda','पाटोदा'],['shirur-k','Shirur Kasar','शिरूर काशार'],['wadwani','Wadwani','वडवणी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'beed'})),
  // Bhandara
  ...[['bhandara-t','Bhandara','भंडारा'],['tumsar','Tumsar','तुमसर'],['mohadi','Mohadi','मोहाडी'],['sakoli','Sakoli','साकोली'],['lakhani','Lakhani','लाखनी'],['lakhandur','Lakhandur','लाखांदूर'],['pauni','Pauni','पौनी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'bhandara'})),
  // Buldhana
  ...[['buldhana-t','Buldhana','बुलढाणा'],['chikhli','Chikhli','चिखली'],['deulgaon-raja','Deulgaon Raja','देऊळगाव राजा'],['jalgaon-jamod','Jalgaon Jamod','जळगाव जामोद'],['khamgaon','Khamgaon','खामगाव'],['lonar','Lonar','लोणार'],['malkapur','Malkapur','मलकापूर'],['mehkar','Mehkar','मेहकर'],['motala','Motala','मोताळा'],['nandura','Nandura','नांदुरा'],['sangrampur','Sangrampur','संग्रामपूर'],['shegaon','Shegaon','शेगाव'],['sindkhed-raja','Sindkhed Raja','सिंदखेड राजा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'buldhana'})),
  // Chandrapur
  ...[['chandrapur-t','Chandrapur','चंद्रपूर'],['ballarpur','Ballarpur','बल्लारपूर'],['brahmapuri','Brahmapuri','ब्रह्मपुरी'],['chimur','Chimur','चिमूर'],['gondpipri','Gondpipri','गोंडपिपरी'],['mul','Mul','मूल'],['nagbhir','Nagbhir','नागभीड'],['pombhurna','Pombhurna','पोंभुर्णा'],['rajura','Rajura','राजुरा'],['sawali','Saoli','साओली'],['sindewahi','Sindewahi','सिंदेवाही'],['warora','Warora','वरोरा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'chandrapur'})),
  // Dhule
  ...[['dhule-t','Dhule','धुळे'],['sakri','Sakri','साक्री'],['shirpur','Shirpur','शिरपूर'],['sindkheda','Sindkheda','सिंदखेडा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'dhule'})),
  // Gadchiroli
  ...[['gadchiroli-t','Gadchiroli','गडचिरोली'],['aheri','Aheri','आहेरी'],['armori','Armori','आरमोरी'],['chamorshi','Chamorshi','चामोर्शी'],['dhanora','Dhanora','धानोरा'],['etapalli','Etapalli','एटापल्ली'],['korchi','Korchi','कोरची'],['kurkheda','Kurkheda','कुरखेडा'],['mulchera','Mulchera','मुलचेरा'],['sironcha','Sironcha','सिरोंचा'],['wadsa','Wadsa','वडसा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'gadchiroli'})),
  // Gondia
  ...[['gondia-t','Gondia','गोंदिया'],['amgaon','Amgaon','आमगाव'],['arjuni-morgaon','Arjuni Morgaon','अर्जुनी मोरगाव'],['deori','Deori','देवरी'],['goregaon','Goregaon','गोरेगाव'],['sadak-arjuni','Sadak Arjuni','सडक अर्जुनी'],['salekasa','Salekasa','सालेकसा'],['tirora','Tirora','तिरोरा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'gondia'})),
  // Hingoli
  ...[['hingoli-t','Hingoli','हिंगोली'],['aundha-nagnath','Aundha Nagnath','औंढा नागनाथ'],['basmath','Basmath','बसमत'],['kalamnuri','Kalamnuri','कळमनुरी'],['sengaon','Sengaon','सेनगाव']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'hingoli'})),
  // Jalgaon
  ...[['jalgaon-t','Jalgaon','जळगाव'],['amalner','Amalner','अमळनेर'],['bhadgaon','Bhadgaon','भडगाव'],['bodwad','Bodwad','बोदवड'],['chalisgaon','Chalisgaon','चाळीसगाव'],['chopda','Chopda','चोपडा'],['dharangaon','Dharangaon','धरणगाव'],['erandol','Erandol','एरंडोल'],['faizpur','Faizpur','फैजपूर'],['jamner','Jamner','जामनेर'],['muktainagar','Muktainagar','मुक्ताईनगर'],['pachora','Pachora','पाचोरा'],['parola','Parola','पारोळा'],['raver','Raver','रावेर'],['yawal','Yawal','यावल']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'jalgaon'})),
  // Jalna
  ...[['jalna-t','Jalna','जालना'],['ambad','Ambad','अंबड'],['badnapur','Badnapur','बदनापूर'],['bhokardan','Bhokardan','भोकरदन'],['ghansavangi','Ghansavangi','घनसावंगी'],['jafrabad','Jafrabad','जाफराबाद'],['mantha','Mantha','मंठा'],['partur','Partur','परतूर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'jalna'})),
  // Kolhapur
  ...[['kolhapur-t','Kolhapur','कोल्हापूर'],['ajra','Ajra','आजरा'],['bhudargad','Bhudargad','भुदरगड'],['chandgad','Chandgad','चंदगड'],['gadhinglaj','Gadhinglaj','गडहिंग्लज'],['gaganbawda','Gaganbawda','गगनबावडा'],['hatkanangle','Hatkanangle','हातकणंगले'],['kagal','Kagal','कागल'],['karvir','Karvir','करवीर'],['panhala','Panhala','पन्हाळा'],['radhanagari','Radhanagari','राधानगरी'],['shahuwadi','Shahuwadi','शाहूवाडी'],['shirol','Shirol','शिरोळ']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'kolhapur'})),
  // Latur
  ...[['latur-t','Latur','लातूर'],['ahmadpur','Ahmadpur','अहमदपूर'],['ausa','Ausa','औसा'],['chakur','Chakur','चाकूर'],['deoni','Deoni','देवणी'],['jalkot','Jalkot','जळकोट'],['nilanga','Nilanga','निलंगा'],['renapur','Renapur','रेणापूर'],['shirur-a','Shirur Anantpal','शिरूर अनंतपाळ'],['udgir','Udgir','उदगीर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'latur'})),
  // Mumbai City & Suburban
  ...[['mumbai-city-t','Mumbai City','मुंबई शहर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'mumbai-city'})),
  ...[['andheri','Andheri','अंधेरी'],['borivali','Borivali','बोरिवली'],['kurla','Kurla','कुर्ला']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'mumbai-suburban'})),
  // Nagpur
  ...[['nagpur-city','Nagpur City','नागपूर शहर'],['nagpur-rural','Nagpur Rural','नागपूर ग्रामीण'],['katol','Katol','काटोल'],['narkhed','Narkhed','नरखेड'],['savner','Savner','सावनेर'],['hingna','Hingna','हिंगणा'],['butibori','Butibori','बुटीबोरी'],['kamptee','Kamptee','कामठी'],['umred','Umred','उमरेड'],['bhiwapur','Bhiwapur','भिवापूर'],['parseoni','Parseoni','पारशिवनी'],['ramtek','Ramtek','रामटेक'],['mauda','Mauda','मौदा'],['kalmeshwar','Kalmeshwar','कळमेश्वर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'nagpur'})),
  // Nanded
  ...[['nanded-t','Nanded','नांदेड'],['ardhapur','Ardhapur','अर्धापूर'],['biloli','Biloli','बिलोली'],['deglur','Deglur','देगलूर'],['dharmabad','Dharmabad','धर्माबाद'],['hadgaon','Hadgaon','हदगाव'],['himayatnagar','Himayatnagar','हिमायतनगर'],['kandhar','Kandhar','कंधार'],['kinwat','Kinwat','किनवट'],['loha','Loha','लोहा'],['mahoor','Mahoor','माहूर'],['mudkhed','Mudkhed','मुदखेड'],['mukhed','Mukhed','मुखेड'],['naigaon','Naigaon','नायगाव'],['umri','Umri','उमरी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'nanded'})),
  // Nandurbar
  ...[['nandurbar-t','Nandurbar','नंदुरबार'],['akkalkuwa','Akkalkuwa','अक्कलकुवा'],['akrani','Akrani','अक्राणी'],['nawapur','Nawapur','नवापूर'],['shahada','Shahada','शहादा'],['taloda','Taloda','तळोदा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'nandurbar'})),
  // Nashik
  ...[['nashik-t','Nashik','नाशिक'],['baglan','Baglan','बागलाण'],['chandvad','Chandvad','चांदवड'],['deola','Deola','देवळा'],['dindori','Dindori','दिंडोरी'],['igatpuri','Igatpuri','इगतपुरी'],['kalwan','Kalwan','कळवण'],['malegaon','Malegaon','मालेगाव'],['nandgaon','Nandgaon','नांदगाव'],['niphad','Niphad','निफाड'],['peint','Peint','पेठ'],['sinnar','Sinnar','सिन्नर'],['surgana','Surgana','सुरगाणा'],['trimbak','Trimbak','त्र्यंबकेश्वर'],['yevla','Yevla','येवला']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'nashik'})),
  // Osmanabad / Dharashiv
  ...[['osmanabad-t','Dharashiv','धाराशिव'],['kalamb','Kalamb','कळंब'],['lohara','Lohara','लोहारा'],['omerga','Omerga','उमरगा'],['paranda','Paranda','परांडा'],['tuljapur','Tuljapur','तुळजापूर'],['washi','Washi','वाशी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'osmanabad'})),
  // Palghar
  ...[['palghar-t','Palghar','पालघर'],['dahanu','Dahanu','डहाणू'],['jawhar','Jawhar','जव्हार'],['mokhada','Mokhada','मोखाडा'],['talasari','Talasari','तलासरी'],['vasai','Vasai','वसई'],['vikramgad','Vikramgad','विक्रमगड'],['wada','Wada','वाडा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'palghar'})),
  // Parbhani
  ...[['parbhani-t','Parbhani','परभणी'],['gangakhed','Gangakhed','गंगाखेड'],['jintur','Jintur','जिंतूर'],['manwath','Manwath','मानवत'],['palam','Palam','पालम'],['pathri','Pathri','पाथरी'],['purna','Purna','पूर्णा'],['selu','Selu','सेलू'],['sonpeth','Sonpeth','सोनपेठ']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'parbhani'})),
  // Pune
  ...[['pune-city','Pune City','पुणे शहर'],['ambegaon','Ambegaon','आंबेगाव'],['baramati','Baramati','बारामती'],['bhor','Bhor','भोर'],['daund','Daund','दौंड'],['haveli','Haveli','हवेली'],['indapur','Indapur','इंदापूर'],['junnar','Junnar','जुन्नर'],['khed','Khed','खेड'],['maval','Maval','मावळ'],['mulshi','Mulshi','मुळशी'],['purandar','Purandar','पुरंदर'],['shirur','Shirur','शिरूर'],['velhe','Velhe','वेल्हे']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'pune'})),
  // Raigad
  ...[['raigad-t','Alibaug','अलिबाग'],['karjat-r','Karjat','कर्जत'],['khalapur','Khalapur','खालापूर'],['mahad','Mahad','माहाड'],['mangaon','Mangaon','माणगाव'],['mhasala','Mhasala','म्हसळा'],['murud','Murud','मुरुड'],['panvel','Panvel','पनवेल'],['pen','Pen','पेण'],['poladpur','Poladpur','पोलादपूर'],['roha','Roha','रोहा'],['shrivardhan','Shrivardhan','श्रीवर्धन'],['sudhagad','Sudhagad','सुधागड'],['tala','Tala','तळा'],['uran','Uran','उरण']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'raigad'})),
  // Ratnagiri
  ...[['ratnagiri-t','Ratnagiri','रत्नागिरी'],['chiplun','Chiplun','चिपळूण'],['dapoli','Dapoli','दापोली'],['guhagar','Guhagar','गुहागर'],['khed-r','Khed','खेड'],['lanja','Lanja','लांजा'],['mandangad','Mandangad','मंडणगड'],['rajapur','Rajapur','राजापूर'],['sangameshwar','Sangameshwar','संगमेश्वर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'ratnagiri'})),
  // Sangli
  ...[['sangli-t','Sangli','सांगली'],['atpadi','Atpadi','आटपाडी'],['jat','Jat','जत'],['kadegaon','Kadegaon','कडेगाव'],['kavathemahankal','Kavathemahankal','कवठेमहांकाळ'],['khanapur','Khanapur','खानापूर'],['miraj','Miraj','मिरज'],['palus','Palus','पलूस'],['shirala','Shirala','शिराळा'],['tasgaon','Tasgaon','तासगाव'],['walwa','Walwa','वाळवा']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'sangli'})),
  // Satara
  ...[['satara-t','Satara','सातारा'],['jaoli','Jaoli','जावली'],['khandala','Khandala','खंडाळा'],['khatav','Khatav','खटाव'],['koregaon','Koregaon','कोरेगाव'],['mahabaleshwar','Mahabaleshwar','महाबळेश्वर'],['man','Man','माण'],['patan','Patan','पाटण'],['phaltan','Phaltan','फलटण'],['wai','Wai','वाई']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'satara'})),
  // Sindhudurg
  ...[['sindhudurg-t','Kudal','कुडाळ'],['deogad','Deogad','देवगड'],['dodamarg','Dodamarg','दोडामार्ग'],['kankavli','Kankavli','कणकवली'],['malvan','Malvan','मालवण'],['sawantwadi','Sawantwadi','सावंतवाडी'],['vaibhavwadi','Vaibhavwadi','वैभववाडी'],['vengurla','Vengurla','वेंगुर्ला']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'sindhudurg'})),
  // Solapur
  ...[['solapur-north','Solapur North','सोलापूर उत्तर'],['solapur-south','Solapur South','सोलापूर दक्षिण'],['akkalkot','Akkalkot','अक्कलकोट'],['barshi','Barshi','बार्शी'],['karmala','Karmala','करमाळा'],['madha','Madha','माढा'],['malshiras','Malshiras','माळशिरस'],['mangalvedha','Mangalvedha','मंगळवेढा'],['mohol','Mohol','मोहोळ'],['pandharpur','Pandharpur','पंढरपूर'],['sangola','Sangola','सांगोला']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'solapur'})),
  // Thane
  ...[['thane-t','Thane','ठाणे'],['ambarnath','Ambarnath','अंबरनाथ'],['bhiwandi','Bhiwandi','भिवंडी'],['kalyan','Kalyan','कल्याण'],['murbad','Murbad','मुरबाड'],['shahapur','Shahapur','शहापूर'],['ulhasnagar','Ulhasnagar','उल्हासनगर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'thane'})),
  // Wardha
  ...[['wardha-t','Wardha','वर्धा'],['arvi','Arvi','आर्वी'],['ashti-w','Ashti','आष्टी'],['deoli','Deoli','देवळी'],['hinganghat','Hinganghat','हिंगणघाट'],['samudrapur','Samudrapur','समुद्रपूर'],['seloo','Seloo','सेलू'],['talegaon-d','Talegaon Dashasar','टाळेगाव दशासर']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'wardha'})),
  // Washim
  ...[['washim-t','Washim','वाशिम'],['karanja','Karanja','कारंजा'],['malegaon-w','Malegaon','मालेगाव'],['mangrulpir','Mangrulpir','मंग्रुळपीर'],['manora','Manora','मानोरा'],['risod','Risod','रिसोड']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'washim'})),
  // Yavatmal
  ...[['yavatmal-t','Yavatmal','यवतमाळ'],['arni','Arni','आर्णी'],['babulgaon','Babulgaon','बाभूळगाव'],['darwha','Darwha','दारव्हा'],['digras','Digras','दिग्रस'],['ghatanji','Ghatanji','घाटाnji'],['kalamb-y','Kalamb','कळंब'],['kelapur','Kelapur','केळापूर'],['mahagaon','Mahagaon','महागाव'],['maregaon','Maregaon','मारेगाव'],['ner','Ner','नेर'],['pusad','Pusad','पुसद'],['ralegaon','Ralegaon','राळेगाव'],['umarkhed','Umarkhed','उमरखेड'],['wani','Wani','वणी'],['zari-jamni','Zari Jamni','झरी जामणी']].map(([id,name,nameMr])=>({id,name,nameMr,districtId:'yavatmal'})),
];

export function getTalukasByDistrict(districtId: string): Taluka[] {
  return MAHARASHTRA_TALUKAS.filter(t => t.districtId === districtId);
}

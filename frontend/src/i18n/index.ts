import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: {
      common: {
        dashboard: 'डैशबोर्ड',
        submit: 'जमा करें',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        language: 'भाषा',
        profile: 'प्रोफ़ाइल',
        rowsPerPage: 'प्रति पृष्ठ पंक्तियाँ',
        page: 'पृष्ठ',
        of: 'का',
        total: 'कुल प्रतिक्रियाएं',
        filter: 'फ़िल्टर',
        signedInAs: 'इस रूप में साइन इन',
        lightMode: 'लाइट मोड में बदलें',
        darkMode: 'डार्क मोड में बदलें',
        ENQUIRE: 'पूछताछ',
        actions: 'कार्रवाई'
      },
      auth: {
        login: 'लॉग इन',
        register: 'पंजीकरण',
        logout: 'लॉग आउट',
        email: 'ईमेल',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        name: 'नाम',
        forgotPassword: 'पासवर्ड भूल गए?',
        noAccount: 'खाता नहीं है?',
        haveAccount: 'पहले से खाता है?',
        passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      },
      feedback: {
        submitNew: 'नई प्रतिक्रिया जमा करें',
        type: 'प्रकार',
        types: {
          COMPLAINT: 'शिकायत',
          SUGGESTION: 'सुझाव',
          ENQUIRE: 'पूछताछ'
        },
        statusLabel: 'स्थिति',
        statusOverview: 'स्थिति अवलोकन',
        typeDistribution: 'प्रतिक्रिया वितरण',
        statuses: {
          PENDING: 'लंबित',
          IN_PROGRESS: 'प्रगति में',
          RESOLVED: 'हल किया गया',
          REJECTED: 'अस्वीकृत'
        },
        department: 'विभाग',
        agency: 'एजेंसी',
        subject: 'विषय',
        description: 'विवरण',
        submit: 'प्रतिक्रिया जमा करें',
        history: 'प्रतिक्रिया इतिहास',
        noFeedbacks: 'कोई प्रतिक्रिया नहीं मिली',
        details: 'प्रतिक्रिया विवरण',
        date: 'जमा करने की तिथि',
        list: 'प्रतिक्रिया सूची',
        fileUploadHint: "5 फ़ाइलें अपलोड करें (PDF, JPEG, PNG)। प्रत्येक अधिकतम 5MB",
        fileLimitExceeded: "अधिकतम 5 फ़ाइलें की अनुमति है",
        invalidFile: "अमान्य फ़ाइल प्रकार या आकार। केवल PDF, JPEG, PNG फ़ाइलें 5MB तक की अनुमति है",
        documents: "अपलोड किए गए दस्तावेज़",
        document: "दस्तावेज़",
        viewDocuments: "दस्तावेज़ देखें",
        departments: {
          banks: "बैंक",
          airlines: "एयरलाइंस",
          telecoms: "दूरसंचार",
          healthcare: "स्वास्थ्य सेवा",
          government: "सरकार",
          finance: "वित्त",
          entertainment: "मनोरंजन",
          railways: "रेलवे"
        }
      },
      departments: {
        banks: 'बैंक',
        airlines: 'एयरलाइंस',
        telecoms: 'दूरसंचार',
        healthcare: 'स्वास्थ्य सेवा',
        government: 'सरकार',
        finance: 'वित्त',
        entertainment: 'मनोरंजन',
      },
      agencies: {
        banks: {
          sbi: 'भारतीय स्टेट बैंक',
          pnb: 'पंजाब नैशनल बैंक',
          boi: 'बैंक ऑफ इंडिया',
          bob: 'बैंक ऑफ बड़ौदा',
          hdfc: 'एचडीएफसी बैंक',
          icici: 'आईसीआईसीआई बैंक',
          axis: 'एक्सिस बैंक',
          kotak: 'कोटक महिंद्रा बैंक'
        },
        airlines: {
          airindia: 'एयर इंडिया',
          vistara: 'विस्तारा',
          indigo: 'इंडिगो',
          spicejet: 'स्पाइसजेट',
          airasia: 'एयर एशिया इंडिया',
          akasa: 'अकासा एयर'
        },
        telecoms: {
          jio: 'रिलायंस जियो',
          airtel: 'भारती एयरटेल',
          vi: 'वोडाफोन आइडिया',
          bsnl: 'बीएसएनएल',
          mtnl: 'एमटीएनएल'
        },
        healthcare: {
          aiims: 'अखिल भारतीय आयुर्विज्ञान संस्थान',
          apollo: 'अपोलो अस्पताल',
          fortis: 'फोर्टिस हेल्थकेयर',
          max: 'मैक्स हेल्थकेयर',
          medanta: 'मेदांता'
        },
        government: {
          central: 'केंद्र सरकार',
          state: 'राज्य सरकार',
          municipal: 'नगर निगम',
          panchayat: 'पंचायती राज'
        },
        finance: {
          sebi: 'सेबी',
          rbi: 'भारतीय रिजर्व बैंक',
          irdai: 'आईआरडीएआई',
          pfrda: 'पीएफआरडीए',
          nabard: 'नाबार्ड'
        },
        entertainment: {
          netflix: 'नेटफ्लिक्स इंडिया',
          amazon: 'अमेज़न प्राइम वीडियो',
          hotstar: 'डिज्नी+ हॉटस्टार',
          sony: 'सोनी लिव',
          zee: 'ज़ी5'
        }
      },
      profile: {
        title: 'प्रोफ़ाइल',
        updateProfile: 'प्रोफ़ाइल अपडेट करें',
        changePassword: 'पासवर्ड बदलें',
        currentPassword: 'वर्तमान पासवर्ड',
        newPassword: 'नया पासवर्ड',
        confirmPassword: 'नए पासवर्ड की पुष्टि करें',
        personalInfo: 'व्यक्तिगत जानकारी',
        update: 'प्रोफ़ाइल अपडेट करें',
        updateSuccess: 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया',
      },
      dashboard: {
        title: 'डैशबोर्ड',
        welcome: 'स्वागत है',
        noFeedbacks: 'कोई प्रतिक्रिया नहीं मिली। अपनी पहली प्रतिक्रिया जमा करें!',
      },
      errors: {
        required: 'यह फ़ील्ड आवश्यक है',
        invalidEmail: 'अमान्य ईमेल पता',
        passwordMismatch: 'पासवर्ड मेल नहीं खाते',
        minLength: 'कम से कम {{length}} अक्षर होने चाहिए',
        serverError: 'सर्वर त्रुटि हुई',
        somethingWentWrong: 'कुछ गलत हो गया',
        tryReloading: 'कृपया पेज को रीलोड करें',
        reload: 'पेज रीलोड करें',
        fileUpload: {
          tooLarge: "फ़ाइल बहुत बड़ी है। अधिकतम आकार 5MB है",
          invalidType: "अमान्य फ़ाइल प्रकार। केवल PDF, JPEG और PNG फ़ाइलों की अनुमति है",
          tooMany: "बहुत सारी फ़ाइलें। अधिकतम 5 फ़ाइलों की अनुमति है"
        }
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    }
  });

export default i18n; 
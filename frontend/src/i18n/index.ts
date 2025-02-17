import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        dashboard: 'Dashboard',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        language: 'Language',
        profile: 'Profile',
        rowsPerPage: 'Rows per page',
        page: 'Page',
        of: 'of',
        total: 'Total Feedbacks',
        filter: 'Filter',
        signedInAs: 'Signed in as',
        lightMode: 'Switch to Light Mode',
        darkMode: 'Switch to Dark Mode',
      },
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        passwordMismatch: 'Passwords do not match',
      },
      feedback: {
        submitNew: 'Submit New Feedback',
        type: 'Type',
        types: {
          COMPLAINT: 'Complaint',
          SUGGESTION: 'Suggestion',
          COMPLIMENT: 'Compliment'
        },
        statusLabel: 'Status',
        statusOverview: 'Status Overview',
        typeDistribution: 'Feedback Distribution',
        statuses: {
          PENDING: 'Pending',
          IN_PROGRESS: 'In Progress',
          RESOLVED: 'Resolved',
          REJECTED: 'Rejected'
        },
        department: 'Department',
        subject: 'Subject',
        description: 'Description',
        submit: 'Submit Feedback',
        history: 'Feedback History',
        noFeedbacks: 'No feedback found',
        details: 'Feedback Details',
        date: 'Submission Date',
        list: 'Feedback List'
      },
      departments: {
        banks: 'Banks',
        airlines: 'Airlines',
        telecoms: 'Telecommunications',
        healthcare: 'Healthcare',
        government: 'Government',
        finance: 'Finance',
        entertainment: 'Entertainment',
      },
      agencies: {
        banks: {
          sbi: 'State Bank of India',
          pnb: 'Punjab National Bank',
          boi: 'Bank of India',
          bob: 'Bank of Baroda',
          hdfc: 'HDFC Bank',
          icici: 'ICICI Bank',
          axis: 'Axis Bank',
          kotak: 'Kotak Mahindra Bank'
        },
        airlines: {
          airindia: 'Air India',
          vistara: 'Vistara',
          indigo: 'IndiGo',
          spicejet: 'SpiceJet',
          airasia: 'Air Asia India',
          akasa: 'Akasa Air'
        },
        telecoms: {
          jio: 'Reliance Jio',
          airtel: 'Bharti Airtel',
          vi: 'Vodafone Idea',
          bsnl: 'BSNL',
          mtnl: 'MTNL'
        },
        healthcare: {
          aiims: 'All India Institute of Medical Sciences',
          apollo: 'Apollo Hospitals',
          fortis: 'Fortis Healthcare',
          max: 'Max Healthcare',
          medanta: 'Medanta'
        },
        government: {
          central: 'Central Government',
          state: 'State Government',
          municipal: 'Municipal Corporation',
          panchayat: 'Panchayati Raj'
        },
        finance: {
          sebi: 'SEBI',
          rbi: 'Reserve Bank of India',
          irdai: 'IRDAI',
          pfrda: 'PFRDA',
          nabard: 'NABARD'
        },
        entertainment: {
          netflix: 'Netflix India',
          amazon: 'Amazon Prime Video',
          hotstar: 'Disney+ Hotstar',
          sony: 'Sony LIV',
          zee: 'ZEE5'
        }
      },
      profile: {
        title: 'Profile',
        updateProfile: 'Update Profile',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        personalInfo: 'Personal Information',
        update: 'Update Profile',
        updateSuccess: 'Profile updated successfully',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome',
        noFeedbacks: 'No feedbacks found. Submit your first feedback!',
      },
      errors: {
        required: 'This field is required',
        invalidEmail: 'Invalid email address',
        passwordMismatch: 'Passwords do not match',
        minLength: 'Must be at least {{length}} characters',
        serverError: 'Server error occurred',
        somethingWentWrong: 'Something went wrong',
        tryReloading: 'Please try reloading the page',
        reload: 'Reload Page',
      },
    },
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
          COMPLIMENT: 'प्रशंसा'
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
        subject: 'विषय',
        description: 'विवरण',
        submit: 'प्रतिक्रिया जमा करें',
        history: 'प्रतिक्रिया इतिहास',
        noFeedbacks: 'कोई प्रतिक्रिया नहीं मिली',
        details: 'प्रतिक्रिया विवरण',
        date: 'जमा करने की तिथि',
        list: 'प्रतिक्रिया सूची'
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
      escapeValue: false,
    },
  });

export default i18n; 
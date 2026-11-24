'use strict';
/* ══════════════════════════════════════════════════════════════
   MODULE: utils / storage
   ══════════════════════════════════════════════════════════════ */
const $ = s => document.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v } catch (e) { return d } },
    set(k, v) { try { localStorage.setItem(k, v) } catch (e) { } }
};
const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (_, k) => vars && vars[k] != null ? vars[k] : '');
function lev(a, b) { // Levenshtein distance for "did you mean" suggestions
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++)cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
    }
    return prev[n];
}

/* ══════════════════════════════════════════════════════════════
   MODULE: i18n — English + Hindi, with tone variants
   ══════════════════════════════════════════════════════════════ */
const I18N = {
    en: {
        status: 'interactive shell', bootSkip: 'press any key to skip',
        boot1: 'Initializing Chandan Portfolio...', boot2: 'Loading terminal environment...',
        boot3: 'Loading profile information...', boot4: 'Loading projects...',
        boot5: 'Establishing interactive shell...', boot6: 'System ready.',
        welcome: "Welcome to Chandan Vyas's Interactive Portfolio.",
        typeHelp: "Type 'help' to explore the terminal.",
        typeSections: 'Or type a section: general · profile · contact · preferences · fun.',
        tipTab: 'Tip: Tab autocompletes · ↑/↓ browse history · “language hi” for Hindi.',
        helpMore: 'Type “help <command>” for details on any command.',
        footerHint: 'tab autocomplete · ↑/↓ history',
        g_general: 'general', g_profile: 'profile', g_contact: 'contact', g_prefs: 'preferences', g_fun: 'fun',
        s_about: 'about', s_skills: 'skills', s_projects: 'projects', s_experience: 'experience', s_education: 'education', s_contact: 'contact',
        l_location: 'location', l_status: 'status', l_exp: 'experience', l_role: 'role', l_duration: 'duration',
        l_tech: 'stack', l_workpref: 'work pref', l_langs: 'languages', l_email: 'email', l_phone: 'phone',
        l_links: 'links', l_qual: 'qualification', l_inst: 'institution', l_stream: 'stream', l_grad: 'graduation',
        l_period: 'period', l_category: 'category', l_repo: 'repository', l_copy: 'copy', l_open: 'open',
        l_resume: 'resume', l_repoPending: 'link pending — see “github”', l_titles: 'titles',
        c_general: 'list every command in the general section',
        c_profile: 'list every command in the profile section',
        c_preferences: 'list every command in the preferences section',
        c_fun: 'list every command in the fun section',
        c_help: 'show all available commands', c_clear: 'clear the terminal output',
        c_whoami: 'identity & tagline', c_date: 'current date & time',
        c_history: 'commands run this session', c_about: 'personal introduction & summary',
        c_skills: 'technical skills by category', c_projects: 'showcase projects — --details · --open <n>',
        c_experience: 'professional experience timeline', c_education: 'education details',
        c_contact: 'contact info & social links', c_resume: 'open the resume PDF',
        c_simsim: 'magic words — opens the resume', c_github: 'open GitHub profile',
        c_linkedin: 'open LinkedIn profile', c_leetcode: 'open LeetCode profile',
        c_instagram: 'open Instagram profile', c_x: 'open X (Twitter) profile',
        c_email: 'compose an email', c_call: 'start a phone call', c_copyemail: 'copy the email address',
        c_game: 'play Snake inside the terminal', c_theme: 'dark / light theme',
        c_language: 'interface language (en | hi)', c_tone: 'reply tone (professional | friendly | technical)',
        c_sound: 'sound effects on | off', c_minimize: 'collapse the terminal panel',
        c_exit: 'same as minimize', c_sudo: 'administrator powers (allegedly)',
        c_echo: 'print text back', c_banner: 'show the name banner',
        'errUnknown.professional': "Unrecognized command: '{c}'",
        'errUnknown.friendly': "Hmm — I don't know '{c}' yet.",
        'errUnknown.technical': "command not found: {c}  (exit 127)",
        suggest: 'Did you mean:',
        'whoamiGreet.professional': 'Identity report —',
        'whoamiGreet.friendly': 'Hey, nice to meet you!',
        'whoamiGreet.technical': 'identity lookup · 1 result',
        'helpLead.professional': "Here's everything this shell can do:",
        'helpLead.friendly': 'Some things worth trying:',
        'helpLead.technical': 'registered commands: {n}',
        m_themeNow: 'theme → {v}', m_themeUsage: 'usage: theme [dark | light]',
        m_soundOn: 'sound effects: on', m_soundOff: 'sound effects: off',
        m_langSet: 'interface language → {v}', m_langUsage: 'usage: language [en | hi]',
        m_toneSet: 'reply tone → {v}', m_toneUsage: 'usage: tone [professional | friendly | technical]',
        m_copied: 'email copied to clipboard ✓', m_copyFail: 'could not access the clipboard — email: {e}',
        m_opening: 'opening {v} …', m_resumeOpen: 'opening resume ({v}) …',
        m_resumeMissing: 'resume not found — add your PDF at {v}',
        m_sectionCmds: 'available commands in this section:',
        m_sectionHint: 'Type any command above to run it.',
        m_resumeUnverified: "couldn't verify the file — attempting to open anyway …",
        m_simsim: '✓ सिम सिम खुल जा — the door opens! Opening resume…',
        m_min: 'terminal minimized — click the header (or run minimize again) to restore',
        m_minStatus: 'minimized — click to restore', m_restored: 'terminal restored',
        m_sudo: 'chandan is not in the sudoers file. This incident will be reported to the portfolio owner.',
        m_exit: 'this shell never really exits — minimizing instead.',
        m_noHistory: 'no commands yet this session.', m_histLead: 'session history:',
        m_noCmdHelp: "no such command: '{c}'",
        m_skillsNoCat: 'no skill category matches “{c}”.', m_skillsAvail: 'available:',
        m_projectsHint: 'details: projects --details · open a repo: projects --open <n>',
        m_expNow: 'current: Trainee @ Erginous Technologies · work preference: Hybrid',
        m_contactHint: "run 'contact --copy' to copy the email address.",
        m_gameIntro: 'launching snake … arrows / WASD move · space pauses · esc closes',
        m_imgAlt: 'Chandan Vyas',
        g_hint: 'arrows / WASD · space pause · esc close',
        g_score: 'score', g_best: 'best',
        g_ready1: 'press an arrow / WASD to start', g_ready2: '(swipe or use the pad on touch)',
        g_paused: 'PAUSED — space to resume', g_over: 'GAME OVER',
        g_overSub: 'score {s} · enter or R to restart · esc to close', g_newBest: 'new best!',
        a_theme: 'toggle theme', a_sound: 'toggle sound effects', a_min: 'minimize / restore terminal', a_lang: 'switch language'
    },
    hi: {
        status: 'इंटरैक्टिव शेल', bootSkip: 'छोड़ने के लिए कोई भी कुंजी दबाएँ',
        boot1: 'चंदन पोर्टफोलियो शुरू हो रहा है...', boot2: 'टर्मिनल वातावरण लोड हो रहा है...',
        boot3: 'प्रोफ़ाइल जानकारी लोड हो रही है...', boot4: 'प्रोजेक्ट्स लोड हो रहे हैं...',
        boot5: 'इंटरैक्टिव शेल तैयार हो रही है...', boot6: 'सिस्टम तैयार।',
        welcome: 'चंदन व्यास के इंटरैक्टिव पोर्टफोलियो में आपका स्वागत है।',
        typeHelp: "टर्मिनल एक्सप्लोर करने के लिए 'help' टाइप करें।",
        typeSections: 'या कोई सेक्शन टाइप करें: general · profile · contact · preferences · fun.',
        tipTab: 'सुझाव: Tab से ऑटोकम्प्लीट · ↑/↓ से इतिहास · अंग्रेज़ी के लिए “language en”。',
        helpMore: 'किसी कमांड की जानकारी के लिए: help <command>',
        footerHint: 'tab ऑटोकम्प्लीट · ↑/↓ इतिहास',
        g_general: 'सामान्य', g_profile: 'प्रोफ़ाइल', g_contact: 'संपर्क', g_prefs: 'सेटिंग्स', g_fun: 'मज़ेदार',
        s_about: 'परिचय', s_skills: 'स्किल्स', s_projects: 'प्रोजेक्ट्स', s_experience: 'अनुभव', s_education: 'शिक्षा', s_contact: 'संपर्क',
        l_location: 'स्थान', l_status: 'स्थिति', l_exp: 'अनुभव', l_role: 'पद', l_duration: 'अवधि',
        l_tech: 'स्टैक', l_workpref: 'कार्य मोड', l_langs: 'भाषाएँ', l_email: 'ईमेल', l_phone: 'फ़ोन',
        l_links: 'लिंक्स', l_qual: 'योग्यता', l_inst: 'संस्थान', l_stream: 'स्ट्रीम', l_grad: 'स्नातकता',
        l_period: 'अवधि', l_category: 'श्रेणी', l_repo: 'रिपॉज़िटरी', l_copy: 'कॉपी', l_open: 'खोलें',
        l_resume: 'रिज़्यूमे', l_repoPending: 'लिंक जल्द — “github” देखें', l_titles: 'टाइटल',
        c_general: 'सामान्य सेक्शन की सभी कमांड दिखाएँ',
        c_profile: 'प्रोफ़ाइल सेक्शन की सभी कमांड दिखाएँ',
        c_preferences: 'सेटिंग्स सेक्शन की सभी कमांड दिखाएँ',
        c_fun: 'मज़ेदार सेक्शन की सभी कमांड दिखाएँ',
        c_help: 'सभी उपलब्ध कमांड दिखाएँ', c_clear: 'टर्मिनल साफ़ करें',
        c_whoami: 'परिचय और टैगलाइन', c_date: 'वर्तमान दिनांक और समय',
        c_history: 'इस सेशन के कमांड', c_about: 'व्यक्तिगत जानकारी और सारांश',
        c_skills: 'श्रेणी के अनुसार तकनीकी स्किल्स', c_projects: 'प्रोजेक्ट — --details · --open <n>',
        c_experience: 'पेशेवर अनुभव', c_education: 'शिक्षा की जानकारी',
        c_contact: 'संपर्क जानकारी और सोशल लिंक', c_resume: 'रिज़्यूमे PDF खोलें',
        c_simsim: 'जादुई शब्द — रिज़्यूमे खोल देते हैं', c_github: 'GitHub प्रोफ़ाइल खोलें',
        c_linkedin: 'LinkedIn प्रोफ़ाइल खोलें', c_leetcode: 'LeetCode प्रोफ़ाइल खोलें',
        c_instagram: 'Instagram खोलें', c_x: 'X (Twitter) प्रोफ़ाइल खोलें',
        c_email: 'ईमेल लिखें', c_call: 'फ़ोन कॉल शुरू करें', c_copyemail: 'ईमेल पता कॉपी करें',
        c_game: 'टर्मिनल में Snake खेलें', c_theme: 'डार्क / लाइट थीम',
        c_language: 'इंटरफ़ेस भाषा (en | hi)', c_tone: 'जवाब का टोन (professional | friendly | technical)',
        c_sound: 'साउंड इफ़ेक्ट्स on | off', c_minimize: 'टर्मिनल पैनल छोटा करें',
        c_exit: 'minimize जैसा ही', c_sudo: 'एडमिन अधिकार (बस एक मज़ाक)',
        c_echo: 'टेक्स्ट दोहराएँ', c_banner: 'नाम का बैनर दिखाएँ',
        'errUnknown.professional': "अज्ञात कमांड: '{c}'",
        'errUnknown.friendly': "हम्म — '{c}' अभी मेरी सूची में नहीं है।",
        'errUnknown.technical': "command not found: {c}  (exit 127)",
        suggest: 'क्या आपका मतलब यह था:',
        'whoamiGreet.professional': 'पहचान रिपोर्ट —',
        'whoamiGreet.friendly': 'अरे नमस्ते! आपसे मिलकर अच्छा लगा।',
        'whoamiGreet.technical': 'identity lookup · 1 result',
        'helpLead.professional': 'यह शेल ये सब कर सकती है:',
        'helpLead.friendly': 'कुछ चीज़ें जो आज़मा सकते हैं:',
        'helpLead.technical': 'registered commands: {n}',
        m_themeNow: 'थीम → {v}', m_themeUsage: 'उपयोग: theme [dark | light]',
        m_soundOn: 'साउंड इफ़ेक्ट्स: चालू', m_soundOff: 'साउंड इफ़ेक्ट्स: बंद',
        m_langSet: 'इंटरफ़ेस भाषा → {v}', m_langUsage: 'उपयोग: language [en | hi]',
        m_toneSet: 'जवाब का टोन → {v}', m_toneUsage: 'उपयोग: tone [professional | friendly | technical]',
        m_copied: 'ईमेल क्लिपबोर्ड पर कॉपी हो गया ✓', m_copyFail: 'क्लिपबोर्ड नहीं मिला — ईमेल: {e}',
        m_opening: '{v} खोला जा रहा है…', m_resumeOpen: 'रिज़्यूमे ({v}) खोला जा रहा है…',
        m_resumeMissing: 'रिज़्यूमे नहीं मिला — अपनी PDF को {v} पर रखें',
        m_sectionCmds: 'इस सेक्शन की उपलब्ध कमांड:',
        m_sectionHint: 'चलाने के लिए ऊपर कोई भी कमांड टाइप करें।',
        m_resumeUnverified: 'फ़ाइल की पुष्टि नहीं हो सकी — फिर भी खोलने की कोशिश की जा रही है…',
        m_simsim: '✓ सिम सिम खुल जा — दरवाज़ा खुल गया! रिज़्यूमे खोला जा रहा है…',
        m_min: 'टर्मिनल छोटा कर दिया गया — वापस लाने के लिए हेडर पर क्लिक करें',
        m_minStatus: 'छोटा किया गया — बड़ा करने के लिए क्लिक करें', m_restored: 'टर्मिनल वापस आ गया',
        m_sudo: 'chandan sudoers फ़ाइल में नहीं है। यह घटना पोर्टफोलियो मालिक को रिपोर्ट की जाएगी।',
        m_exit: 'यह शेल कभी बंद नहीं होती — इसे छोटा कर दिया जा रहा है।',
        m_noHistory: 'इस सेशन में अभी कोई कमांड नहीं चला।', m_histLead: 'सेशन इतिहास:',
        m_noCmdHelp: "'{c}' नाम का कोई कमांड नहीं है।",
        m_skillsNoCat: '“{c}” से कोई श्रेणी मेल नहीं खाती।', m_skillsAvail: 'उपलब्ध:',
        m_projectsHint: 'विवरण: projects --details · रिपो खोलें: projects --open <n>',
        m_expNow: 'वर्तमान: Erginous Technologies में Trainee · कार्य मोड: Hybrid',
        m_contactHint: "ईमेल कॉपी करने के लिए 'contact --copy' चलाएँ।",
        m_gameIntro: 'snake लॉन्च हो रहा है… तीर/WASD से चलें · space से pause · esc से बंद',
        m_imgAlt: 'चंदन व्यास',
        g_hint: 'तीर / WASD · space से pause · esc से बंद',
        g_score: 'स्कोर', g_best: 'बेस्ट',
        g_ready1: 'शुरू करने के लिए कोई तीर / WASD दबाएँ', g_ready2: '(टच पर स्वाइप करें या पैड इस्तेमाल करें)',
        g_paused: 'रुका हुआ — जारी रखने के लिए space', g_over: 'गेम ओवर',
        g_overSub: 'स्कोर {s} · फिर से खेलें: enter या R · बंद: esc', g_newBest: 'नया बेस्ट!',
        a_theme: 'थीम बदलें', a_sound: 'साउंड चालू/बंद करें', a_min: 'टर्मिनल छोटा/बड़ा करें', a_lang: 'भाषा बदलें'
    }
};
let LANG = store.get('cv-lang', 'en'); if (!I18N[LANG]) LANG = 'en';
let TONE = store.get('cv-tone', 'professional');
if (!['professional', 'friendly', 'technical'].includes(TONE)) TONE = 'professional';
const t = k => I18N[LANG][k] ?? I18N.en[k] ?? k;
const tt = p => { // tone-aware key: `${p}.${TONE}` with fallbacks
    const k = p + '.' + TONE;
    return I18N[LANG][k] ?? I18N[LANG][p + '.professional'] ?? I18N.en[k] ?? I18N.en[p + '.professional'] ?? '';
};

/* ══════════════════════════════════════════════════════════════
   MODULE: data — everything the owner edits lives HERE
   ══════════════════════════════════════════════════════════════ */
//Isko change kiya hai
//Resume Work
const RESUME_URL = 'https://app.notion.com/p/Resume-42215f8fd97b80ec8410ceb88effe20b?source=copy_link';

const PROFILE = {
    name: 'Chandan Vyas', location: 'Meerut, India',
    status: 'Final Year Computer Science Student', expLevel: 'Fresher',
    tagline: 'Even bugs come to me for solutions.',
    intro: "I'm Chandan Vyas, Future Developer.",
    summaryLong: 'Passionate about solving problems, building scalable applications, and turning complex ideas into efficient software solutions.',
    workPref: 'Hybrid',
    titles: ['Just a Coder', 'Frontend Developer', 'Web Developer', 'Software Developer', 'Full Stack Developer'],
    languages: [['Hindi', 'Native'], ['English', 'Intermediate'], ['Punjabi', 'Intermediate'], ['Korean', 'Beginner']],
};

const SOCIALS = {
    email: 'cvhindu999@gmail.com',
    phone: '+91 96802 33136', phoneTel: '+919680233136',
    profiles: [
        { label: 'GitHub', url: 'https://github.com/chandanvyas999' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/chandan-vyas/' },
        { label: 'LeetCode', url: 'https://www.leetcode.com/chandanvyas999' },
        { label: 'Instagram', url: 'https://www.instagram.com/chandanvyas999' },
        { label: 'X (Twitter)', url: 'https://www.x.com/chandanvyas999' }
    ]
};

const SKILLS = [
    { id: 'languages', label: { en: 'Languages & Web', hi: 'भाषाएँ और वेब' }, items: ['HTML', 'CSS', 'JavaScript', 'Java', 'Python', 'PHP', 'SQL', 'C#'] },
    { id: 'frontend', label: { en: 'Frontend', hi: 'फ्रंटएंड' }, items: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'] },
    { id: 'backend', label: { en: 'Backend', hi: 'बैकएंड' }, items: ['Java', 'PHP', 'Node.js', 'Flask', 'ASP.NET MVC'] },
    { id: 'databases', label: { en: 'Databases', hi: 'डेटाबेस' }, items: ['MySQL', 'MongoDB', 'SQL', 'SQL Server'] },
    { id: 'dataml', label: { en: 'Data & ML', hi: 'डेटा और ML' }, items: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
    { id: 'tools', label: { en: 'Tools', hi: 'टूल्स' }, items: ['Git', 'GitHub', 'VS Code', 'Visual Studio 2022', 'Jupyter Notebook', 'Google Colab'] },
    { id: 'fundamentals', label: { en: 'Fundamentals', hi: 'मूल सिद्धांत' }, items: ['OOP', 'Computer Networks'] }
];

const PROJECTS = [
    {
        id: 1, name: 'Terminal Portfolio',
        category: 'Portfolio',
        stack: ['HTML', 'CSS', 'JavaScript'],
        repo: 'https://github.com/chandanvyas999/Portfolio.git',
        points: [
            'This is my portfolio website; you are currently on it.',
            'Do let me know what you think, as I have put some efforts into this.',
            'This was not something that could be done with just a single prompt.'
        ]
    },
    {
        id: 2, name: 'E-Commerce-Analytics-with-Machine-Learning',
        category: 'Machine Learning / Data Analytics',
        stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
        repo: 'https://github.com/chandanvyas999/E-Commerce-Analytics-with-Machine-Learning',
        points: [
            'Analyzes e-commerce customer activity data to explore how session length, app and website usage, and membership duration relate to yearly spending.',
            'Performs dataset inspection and exploratory analysis, preparing feature relationships for visualization and data-driven insights.'
        ]
    },
    {
        id: 3, name: 'House-Price-Prediction',
        category: 'Machine Learning',
        stack: ['Python', 'Flask', 'Pandas', 'Scikit-learn', 'Jupyter Notebook'],
        repo: 'https://github.com/chandanvyas999/House-Price-Prediction',
        points: [
            'Developed a machine-learning model to estimate house prices from property attributes such as bedrooms, bathrooms, size and ZIP code.',
            'Organized datasets, model artifacts and Jupyter notebooks; integrated the trained Ridge Regression model into a Flask-based prediction workflow.'
        ]
    },
    {
        id: 4, name: 'Movie-Recommendations',
        category: 'Machine Learning',
        stack: ['Python', 'Machine Learning', 'Jupyter Notebook'],
        repo: 'https://github.com/chandanvyas999/Movie-Recommendations',
        points: [
            'Built a movie-recommendation machine-learning project using a dataset collected from Kaggle.',
            'Organized the project with Python scripts, a Jupyter notebook, dataset and application files.'
        ]
    }
];

const EXPERIENCE = [
    {
        company: 'Erginous Technologies', role: 'Trainee', duration: 'May 2026 – Present', location: 'Rajpura, Punjab',
        tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'jQuery', 'PHP', 'MySQL'],
        points: [
            'Developing responsive web pages with clean layouts and a consistent user experience.',
            'Implementing frontend components using HTML, CSS and Bootstrap.',
            'Creating interactive functionality with JavaScript and jQuery — client-side interactions, form behavior and smoother page transitions.',
            'Building PHP-based website functionality using object-oriented programming concepts and integrating MySQL for data storage.',
            'Debugging and improving existing web applications, following practical development workflows.'
        ]
    },
    {
        company: 'CETPA Infotech Pvt. Ltd.', role: 'Trainee (College Training)', duration: 'Feb 2025 – Sep 2025', location: 'Meerut',
        tech: ['C#', 'ASP.NET MVC', '.NET Framework', 'Visual Studio 2022', 'SQL Server'],
        points: [
            'Practiced application development using C#, ASP.NET MVC and the .NET Framework in Visual Studio 2022.',
            'Built a CRUD application implementing create, read, update and delete operations with SQL Server database connectivity.'
        ]
    },
    {
        company: 'Elight Coder', role: 'Open-Source Contributor', duration: 'Jan 2026 – Feb 2026', location: 'Remote',
        tech: ['GitHub', 'Open Source'],
        points: [
            'Raised an issue to report a project concern and supported discussion around a possible improvement.',
            'Submitted one pull request, gaining practical experience with GitHub collaboration and the open-source contribution workflow.'
        ]
    }
];

const EDUCATION = {
    qualification: 'Bachelor of Technology (B.Tech)',
    stream: 'Computer Science',
    institution: 'Subharti Institute of Technology & Engineering',
    location: 'Meerut, Uttar Pradesh',
    period: '2023 – 2027', graduation: '2027 (expected)'
};

/* ══════════════════════════════════════════════════════════════
   MODULE: sound-manager — Web Audio API, synthesized (no assets)
   ══════════════════════════════════════════════════════════════ */
const Sound = {
    enabled: store.get('cv-sound', 'on') !== 'off',
    ctx: null, last: 0,
    unlock() { // only ever called from a real user gesture (autoplay policy)
        if (!this.enabled) return;
        try {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();
        } catch (e) { }
    },
    blip(freq, dur, type = 'square', vol = 0.035, slide = null, when = 0) {
        if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
        const c = this.ctx, t0 = c.currentTime + when;
        const o = c.createOscillator(), g = c.createGain();
        o.type = type; o.frequency.setValueAtTime(freq, t0);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
        g.gain.setValueAtTime(vol, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(c.destination);
        o.start(t0); o.stop(t0 + dur + 0.02);
    },
    key() {
        const n = performance.now(); if (n - this.last < 28) return; this.last = n;
        this.blip(2600 + Math.random() * 600, 0.015, 'square', 0.012);
    },
    click() { this.blip(950, 0.03, 'square', 0.03); },
    exec() { this.blip(620, 0.05, 'square', 0.03); this.blip(880, 0.06, 'square', 0.03, null, 0.055); },
    ok() { [523.25, 659.25, 783.99].forEach((f, i) => this.blip(f, 0.09, 'triangle', 0.05, null, i * 0.07)); },
    err() { this.blip(220, 0.16, 'sawtooth', 0.045, 110); },
    eat() { this.blip(988, 0.05, 'square', 0.05); this.blip(1318, 0.06, 'square', 0.05, null, 0.05); },
    turn() { this.blip(500, 0.02, 'square', 0.015); },
    over() { this.blip(392, 0.4, 'sawtooth', 0.06, 98); }
};
// first intentional gesture anywhere unlocks audio (if enabled)
const unlockOnce = () => { Sound.unlock(); removeEventListener('pointerdown', unlockOnce); removeEventListener('keydown', unlockOnce); };
addEventListener('pointerdown', unlockOnce); addEventListener('keydown', unlockOnce);

/* ══════════════════════════════════════════════════════════════
   MODULE: theme-manager
   ══════════════════════════════════════════════════════════════ */
function applyTheme(v) {
    document.documentElement.setAttribute('data-theme', v);
    store.set('cv-theme', v);
    $('#btnTheme').setAttribute('aria-pressed', v === 'light' ? 'true' : 'false');
}
function curTheme() { return document.documentElement.getAttribute('data-theme'); }
function toggleTheme(quiet) {
    const v = curTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(v); Sound.click();
    if (!quiet) addLine([span(fmt(t('m_themeNow'), { v }), 'mut')]);
}

/* ══════════════════════════════════════════════════════════════
   MODULE: terminal output engine
   ══════════════════════════════════════════════════════════════ */
const tbody = $('#tbody'), out = $('#output'), cmdInput = $('#cmd');
function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function span(text, cls) { const s = el('span', cls); s.textContent = String(text); return s; }
function scroll() { tbody.scrollTop = tbody.scrollHeight; }
function addLine(children, cls) {
    const d = el('div', 'ln' + (cls ? ' ' + cls : ''));
    [].concat(children).forEach(c => {
        if (c == null) return;
        d.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    out.appendChild(d); scroll(); return d;
}
function blank() { return addLine(['']); }
function section(title) {
    const d = el('div', 'ln sec');
    d.appendChild(span('──', 'sec-mark'));
    d.appendChild(span(' ' + title.toUpperCase(), 'sec-title'));
    d.appendChild(el('span', 'rule'));
    out.appendChild(d); scroll();
}
function kv(key, value) { // aligned key/value rows; value may be text, Node, or array
    const d = el('div', 'ln kv');
    d.appendChild(span(key, 'k'));
    const v = el('span', 'v');
    if (value instanceof Node) v.appendChild(value);
    else if (Array.isArray(value)) value.forEach(x => v.appendChild(x instanceof Node ? x : document.createTextNode(String(x))));
    else v.appendChild(document.createTextNode(String(value)));
    d.appendChild(v); out.appendChild(d); scroll();
}
function link(href, text) {
    const a = el('a', 'lnk'); a.href = href; a.textContent = text;
    if (/^https?:/i.test(href) || /\.pdf/i.test(href)) {
        a.target = '_blank'; a.rel = 'noopener noreferrer';
    }
    return a;
}
function linkbtn(text, fn) {
    const b = el('button', 'linkbtn'); b.type = 'button'; b.textContent = text;
    b.addEventListener('click', e => { e.stopPropagation(); Sound.click(); fn(); });
    return b;
}
function chipSpans(items) {
    const f = document.createDocumentFragment();
    items.forEach(i => { f.appendChild(span(i, 'chip')); f.appendChild(document.createTextNode(' ')); });
    return f;
}
function promptFrag() {
    const f = document.createDocumentFragment();
    f.appendChild(span('chandan@portfolio', 'pu'));
    f.appendChild(span(':', 'pd')); f.appendChild(span('~', 'pp')); f.appendChild(span('$ ', 'pd'));
    return f;
}
function echoLine(raw) {
    const d = el('div', 'ln echo');
    d.appendChild(promptFrag()); d.appendChild(span(raw, 'cmdtext'));
    out.appendChild(d); scroll();
}

/* ── ASCII banner (hand-built shade font) ── */
const BANNER_C =
    ' ██████╗ ██╗  ██╗  █████╗  ███╗   ██╗ ██████╗   █████╗  ███╗   ██╗\n' +
    '██╔════╝ ██║  ██║ ██╔══██╗ ████╗  ██║ ██╔══██╗ ██╔══██╗ ████╗  ██║\n' +
    '██║      ███████║ ███████║ ██╔██╗ ██║ ██║  ██║ ███████║ ██╔██╗ ██║\n' +
    '██║      ██╔══██║ ██╔══██║ ██║╚██╗██║ ██║  ██║ ██╔══██║ ██║╚██╗██║\n' +
    '╚██████╗ ██║  ██║ ██║  ██║ ██║ ╚████║ ██████╔╝ ██║  ██║ ██║ ╚████║\n' +
    ' ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝';
const BANNER_V =
    '              ██╗   ██╗ ██╗   ██╗  █████╗ ███████╗\n' +
    '              ██║   ██║ ╚██╗ ██╔╝ ██╔══██╗ ██╔════╝\n' +
    '              ██║   ██║  ╚████╔╝  ███████║ ███████╗\n' +
    '              ╚██╗ ██╔╝   ╚██╔╝   ██╔══██║ ╚════██║\n' +
    '               ╚████╔╝     ██║    ██║  ██║ ███████║\n' +
    '                ╚═══╝      ╚═╝    ╚═╝  ╚═╝ ╚══════╝';
function printBanner() {
    const w = el('div', 'banner-wrap');
    const p1 = el('pre'); p1.textContent = BANNER_C;
    const p2 = el('pre'); p2.textContent = BANNER_V;
    w.appendChild(p1); w.appendChild(p2);
    out.appendChild(w); scroll();
}

/* ══════════════════════════════════════════════════════════════
   MODULE: history — session-scoped, ↑/↓ navigation
   ══════════════════════════════════════════════════════════════ */
const History = {
    list: [], idx: 0, draft: '',
    push(c) { this.list.push(c); if (this.list.length > 150) this.list.shift(); this.idx = this.list.length; },
    up() {
        if (!this.list.length) return;
        if (this.idx === this.list.length) this.draft = cmdInput.value;
        this.idx = Math.max(0, this.idx - 1); cmdInput.value = this.list[this.idx]; this.end();
    },
    down() {
        if (this.idx >= this.list.length - 1) { this.idx = this.list.length; cmdInput.value = this.draft; this.end(); return; }
        this.idx++; cmdInput.value = this.list[this.idx]; this.end();
    },
    end() { const n = cmdInput.value.length; try { cmdInput.setSelectionRange(n, n); } catch (e) { } }
};

/* ══════════════════════════════════════════════════════════════
   MODULE: command registry — add a command = one object
   ══════════════════════════════════════════════════════════════ */
const REG = [];
const cmd = o => { REG.push(o); return o; };
const findCmd = n => REG.find(c => c.name === n || (c.aliases || []).includes(n));
const descOf = c => (c.desc && c.desc[LANG]) || c.desc.en;
function allNames() {
    const s = new Set();
    REG.forEach(c => { s.add(c.name); (c.aliases || []).forEach(a => s.add(a)); });
    return [...s];
}
function go(url, label) {
    addLine([span(fmt(t('m_opening'), { v: label }), 'mut')]);
    window.open(url, '_blank', 'noopener'); Sound.click();
}

async function copyEmail() {
    try {
        await navigator.clipboard.writeText(SOCIALS.email);
        addLine([span(t('m_copied'), 'ok')]); Sound.ok();
    }
    catch (e) {
        try {
            const ta = el('textarea'); ta.value = SOCIALS.email; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
            addLine([span(t('m_copied'), 'ok')]); Sound.ok();
        } catch (e2) { addLine([span(fmt(t('m_copyFail'), { e: SOCIALS.email }), 'amb')]); Sound.err(); }
    }
}
//Isko Change kiya hai
//Resume Work
function openResume(magic) {
    addLine([
        span(
            magic ? t('m_simsim') : 'Opening resume in a new tab...',
            'ok'
        )
    ]);

    window.open(RESUME_URL, '_blank', 'noopener,noreferrer');
    Sound.ok();

    kv(t('l_resume'), [
        link(RESUME_URL, 'View Resume on Notion'),
        ' ',
        linkbtn(t('l_open'), () => window.open(
            RESUME_URL,
            '_blank',
            'noopener,noreferrer'
        ))
    ]);
}
//Isko Change kiya hai
//Project work
function printProject(p) {
    blank();
    section(`[${p.id}] ${p.name}`);

    kv('Project Name', p.name);
    kv('Category', p.category);
    kv('Tech Stack', chipSpans(p.stack));

    addLine([span('Description', 'b cy')]);

    p.points.forEach(pt => {
        addLine([
            span('  • ', 'ok'),
            span(pt)
        ]);
    });

    if (p.repo) {
        kv('Repository', link(p.repo, 'View GitHub Repository ↗'));
    }

    blank();
}

/* ── general ─────────────────────────────────────────────────── */
cmd({
    name: 'help', usage: 'help [command]', group: 'general', desc: { en: I18N.en.c_help, hi: I18N.hi.c_help },
    complete: tok => tok.length <= 2 ? allNames() : [],
    run(a) {
        if (a[0]) {
            const c = findCmd(a[0].toLowerCase());
            if (!c) { addLine([span(fmt(t('m_noCmdHelp'), { c: a[0] }), 'err')]); return; }
            addLine([span(c.usage || c.name, 'b cy')]);
            addLine([span(descOf(c), 'mut')]);
            if (c.ex) c.ex.forEach(x => addLine([span('  · ' + x, 'dim')]));
            return;
        }
        addLine([span(fmt(tt('helpLead'), { n: REG.length }), 'mut')]); blank();
        ['general', 'profile', 'contact', 'prefs', 'fun'].forEach(g => {
            const cs = REG.filter(c => c.group === g && !c.hidden);
            if (!cs.length) return;
            addLine([span('· ' + t('g_' + g), 'sec-mini')]);
            cs.forEach(c => {
                const d = el('div', 'ln hrow');
                d.appendChild(span(c.usage || c.name, 'usage'));
                d.appendChild(span(descOf(c), 'hdesc'));
                out.appendChild(d);
            });
            blank();
        });
        addLine([span(t('helpMore'), 'dim')]);
        addLine([span(t('tipTab'), 'dim')]);
    }
});

cmd({
    name: 'clear', group: 'general', desc: { en: I18N.en.c_clear, hi: I18N.hi.c_clear },
    run() { out.innerHTML = ''; }
});

cmd({
    name: 'whoami', group: 'general', desc: { en: I18N.en.c_whoami, hi: I18N.hi.c_whoami },
    run() {
        addLine([span(tt('whoamiGreet'), 'cy')]); blank();
        addLine([span(PROFILE.name, 'b')]);
        addLine([span(PROFILE.intro)]);
        addLine([span('“' + PROFILE.tagline + '”', 'ok')]); blank();
        kv(t('l_titles'), chipSpans(PROFILE.titles));
        kv(t('l_location'), PROFILE.location);
        kv(t('l_status'), PROFILE.status);
    }
});

cmd({
    name: 'date', group: 'general', desc: { en: I18N.en.c_date, hi: I18N.hi.c_date },
    run() {
        const loc = LANG === 'hi' ? 'hi-IN' : 'en-GB', d = new Date();
        addLine([span(new Intl.DateTimeFormat(loc, { dateStyle: 'full' }).format(d), 'b')]);
        addLine([span(new Intl.DateTimeFormat(loc, { timeStyle: 'medium' }).format(d), 'cy')]);
        addLine([span(Intl.DateTimeFormat().resolvedOptions().timeZone, 'dim')]);
    }
});

cmd({
    name: 'history', group: 'general', desc: { en: I18N.en.c_history, hi: I18N.hi.c_history },
    run() {
        if (!History.list.length) { addLine([span(t('m_noHistory'), 'dim')]); return; }
        addLine([span(t('m_histLead'), 'mut')]);
        History.list.forEach((h, i) => addLine([span(String(i + 1).padStart(3, ' ') + '  ', 'dim'), span(h)]));
    }
});

cmd({
    name: 'banner', group: 'general', desc: { en: I18N.en.c_banner, hi: I18N.hi.c_banner },
    run() { printBanner(); addLine([span('“' + PROFILE.tagline + '”', 'cy')]); }
});

cmd({
    name: 'echo', usage: 'echo <text>', group: 'general', desc: { en: I18N.en.c_echo, hi: I18N.hi.c_echo },
    run(a, raw) { addLine([raw.replace(/^\S+\s*/, '') || ' ']); }
});

/* ── profile ─────────────────────────────────────────────────── */
cmd({
    name: 'about', group: 'profile', desc: { en: I18N.en.c_about, hi: I18N.hi.c_about },
    async run() {
        section(t('s_about'));
        addLine([span(PROFILE.intro, 'b')]);
        addLine([span(PROFILE.summaryLong)]); blank();
        kv(t('l_status'), PROFILE.status);
        kv(t('l_exp'), PROFILE.expLevel);
        kv(t('l_workpref'), PROFILE.workPref);
        kv(t('l_langs'), PROFILE.languages.map(l => l[0] + ' (' + l[1] + ')').join('  '));
        kv(t('l_location'), PROFILE.location);       
    }
});

cmd({
    name: 'skills', usage: 'skills [category]', group: 'profile',
    desc: { en: I18N.en.c_skills, hi: I18N.hi.c_skills },
    complete: () => SKILLS.map(s => s.id),
    run(a) {
        const q = a.join(' ').toLowerCase();
        const cats = q ? SKILLS.filter(s => s.id.includes(q) || s.label.en.toLowerCase().includes(q) || s.label.hi.includes(q)) : SKILLS;
        if (!cats.length) {
            addLine([span(fmt(t('m_skillsNoCat'), { c: q }), 'err')]);
            addLine([span(t('m_skillsAvail') + ' ' + SKILLS.map(s => s.id).join(' · '), 'dim')]);
            return;
        }
        section(t('s_skills'));
        cats.forEach(s => {
            addLine([span(s.label[LANG] || s.label.en, 'b cy')]);
            addLine(chipSpans(s.items));
        });
    }
});

cmd({
    name: 'projects', usage: 'projects [flags]', group: 'profile',
    desc: { en: I18N.en.c_projects, hi: I18N.hi.c_projects },
    ex: ['projects --details', 'projects 2', 'projects --open 1'],
    complete(tok) {
        if (tok.length === 2) return ['--details', '--open', '1', '2', '3'];
        if (tok.length === 3 && tok[1] === '--open') return ['1', '2', '3'];
        return [];
    },
    //Isko Change kiya hai
    //Ye project section ka UI hai
    //Project Work
    run(a) {
        if (a[0] === '--open' || a[0] === '-o') {
            const n = parseInt(a[1], 10);
            const p = PROJECTS.find(x => x.id === n);

            if (!p) {
                addLine([span('Invalid project number: ' + a[1], 'err')]);
                Sound.err();
                return;
            }

            if (!p.repo) {
                addLine([span(t('l_repoPending'), 'amb')]);
                return;
            }

            go(p.repo, p.name);
            return;
        }

        const num = parseInt(a[0], 10);

        if (num) {
            const p = PROJECTS.find(x => x.id === num);

            if (!p) {
                addLine([span('No project found with number ' + num, 'err')]);
                return;
            }

            printProject(p);
            return;
        }

        section(t('s_projects'));

        addLine([
            span('Total Projects: ' + PROJECTS.length, 'mut')
        ]);

        PROJECTS.forEach(p => {
            printProject(p);
        });

        addLine([
            span('Tip: Type a project number (1, 2, 3...) to view its details.', 'dim')
        ]);

        addLine([
            span('Tip: Use projects --open 1 to directly open its GitHub repository.', 'dim')
        ]);
    }
});

cmd({
    name: 'experience', group: 'profile', desc: { en: I18N.en.c_experience, hi: I18N.hi.c_experience },
    //Change kiya hai
    //Experience section ka UI hai
    //Experience Work
    run() {
        section(t('s_experience'));

        EXPERIENCE.forEach((x, index) => {

            // Add spacing only between companies
            if (index > 0) {
                blank();
                blank();
            }

            addLine([
                span(x.company, 'b'),
                span('  ·  ' + x.location, 'dim')
            ]);

            kv(t('l_role'), x.role);
            kv(t('l_duration'), x.duration);

            x.points.forEach(pt => {
                addLine([
                    span('  • ', 'ok'),
                    span(pt)
                ]);
            });

            kv(t('l_tech'), chipSpans(x.tech));
        });

        blank();
    }
});

cmd({
    name: 'education', group: 'profile', desc: { en: I18N.en.c_education, hi: I18N.hi.c_education },
    run() {
        section(t('s_education'));
        kv(t('l_qual'), EDUCATION.qualification);
        kv(t('l_stream'), EDUCATION.stream);
        kv(t('l_inst'), EDUCATION.institution);
        kv(t('l_location'), EDUCATION.location);
        kv(t('l_period'), EDUCATION.period);
        kv(t('l_grad'), EDUCATION.graduation);
    }
});

/* ── contact ─────────────────────────────────────────────────── */
cmd({
    name: 'contact', usage: 'contact [--copy]', group: 'contact',
    desc: { en: I18N.en.c_contact, hi: I18N.hi.c_contact },
    complete: () => ['--copy'],
    async run(a) {
        section(t('s_contact'));
        kv(t('l_email'), [link('mailto:' + SOCIALS.email, SOCIALS.email), ' ', linkbtn(t('l_copy'), copyEmail)]);
        kv(t('l_phone'), link('tel:' + SOCIALS.phoneTel, SOCIALS.phone));
        kv(t('l_resume'), [link(RESUME_URL, RESUME_FILE), ' ', linkbtn(t('l_open'), () => openResume(false))]);
        SOCIALS.profiles.forEach(p => kv(p.label, link(p.url, p.url.replace(/^https:\/\//, ''))));
        blank(); addLine([span(t('m_contactHint'), 'dim')]);
        blank();
        addLine([span(t('m_sectionCmds'), 'mut')]);
        blank();
        printGroupCommands('contact');
        blank();
        addLine([span(t('m_sectionHint'), 'dim')]);
        if (a.includes('--copy') || a[0] === 'copy') await copyEmail();
    }
});

cmd({
    name: 'copyemail', aliases: ['copy-email'], group: 'contact',
    desc: { en: I18N.en.c_copyemail, hi: I18N.hi.c_copyemail }, run: copyEmail
});

cmd({
    name: 'resume', group: 'contact', desc: { en: I18N.en.c_resume, hi: I18N.hi.c_resume },
    run: () => openResume(false)
});

cmd({
    name: 'sim sim khul ja', aliases: ['simsim'], group: 'fun',
    desc: { en: I18N.en.c_simsim, hi: I18N.hi.c_simsim }, run: () => openResume(true)
});

cmd({
    name: 'github', group: 'contact', desc: { en: I18N.en.c_github, hi: I18N.hi.c_github },
    run: () => go('https://github.com/chandanvyas999', 'GitHub')
});
cmd({
    name: 'linkedin', group: 'contact', desc: { en: I18N.en.c_linkedin, hi: I18N.hi.c_linkedin },
    run: () => go('https://www.linkedin.com/in/chandan-vyas/', 'LinkedIn')
});
cmd({
    name: 'leetcode', group: 'contact', desc: { en: I18N.en.c_leetcode, hi: I18N.hi.c_leetcode },
    run: () => go('https://www.leetcode.com/chandanvyas999', 'LeetCode')
});
cmd({
    name: 'instagram', group: 'contact', desc: { en: I18N.en.c_instagram, hi: I18N.hi.c_instagram },
    run: () => go('https://www.instagram.com/chandanvyas999', 'Instagram')
});
cmd({
    name: 'x', aliases: ['twitter'], group: 'contact', desc: { en: I18N.en.c_x, hi: I18N.hi.c_x },
    run: () => go('https://www.x.com/chandanvyas999', 'X')
});
cmd({
    name: 'email', group: 'contact', desc: { en: I18N.en.c_email, hi: I18N.hi.c_email },
    run: () => { go('mailto:' + SOCIALS.email, 'email'); location.href = 'mailto:' + SOCIALS.email; }
});
cmd({
    name: 'call', aliases: ['phone'], group: 'contact', desc: { en: I18N.en.c_call, hi: I18N.hi.c_call },
    run: () => {
        addLine([span(fmt(t('m_opening'), { v: 'tel ' + SOCIALS.phone }), 'mut')]);
        location.href = 'tel:' + SOCIALS.phoneTel; Sound.click();
    }
});

/* ── preferences ─────────────────────────────────────────────── */
cmd({
    name: 'theme', usage: 'theme [dark|light]', group: 'prefs',
    desc: { en: I18N.en.c_theme, hi: I18N.hi.c_theme }, complete: () => ['dark', 'light', 'toggle'],
    run(a) {
        const v = a[0];
        if (!v) { addLine([span(fmt(t('m_themeNow'), { v: curTheme() }), 'mut'), span('  ·  ' + t('m_themeUsage'), 'dim')]); return; }
        if (v === 'toggle') { toggleTheme(); return; }
        if (v === 'dark' || v === 'light') { applyTheme(v); addLine([span(fmt(t('m_themeNow'), { v }), 'mut')]); Sound.click(); }
        else addLine([span(t('m_themeUsage'), 'dim')]);
    }
});

cmd({
    name: 'language', aliases: ['lang'], usage: 'language [en|hi]', group: 'prefs',
    desc: { en: I18N.en.c_language, hi: I18N.hi.c_language }, complete: () => ['en', 'hi'],
    run(a) {
        const v = (a[0] || '').toLowerCase(), map = { en: 'en', english: 'en', hi: 'hi', hindi: 'hi' };
        if (!v) {
            addLine([span(fmt(t('m_langNow'), { v: LANG === 'hi' ? 'हिन्दी' : 'English' }), 'mut')]);
            addLine([span(t('m_langUsage'), 'dim')]); return;
        }
        if (map[v]) { setLang(map[v]); addLine([span(fmt(t('m_langSet'), { v: map[v] === 'hi' ? 'हिन्दी' : 'English' }), 'mut')]); Sound.click(); }
        else addLine([span(t('m_langUsage'), 'dim')]);
    }
});

cmd({
    name: 'tone', usage: 'tone [mode]', group: 'prefs',
    desc: { en: I18N.en.c_tone, hi: I18N.hi.c_tone }, complete: () => ['professional', 'friendly', 'technical'],
    run(a) {
        const v = (a[0] || '').toLowerCase();
        if (['professional', 'friendly', 'technical'].includes(v)) {
            TONE = v; store.set('cv-tone', v);
            addLine([span(fmt(t('m_toneSet'), { v }), 'mut'), span('  ·  ' + tt('errUnknown').replace('{c}', '…'), 'dim')]);
            Sound.click();
        } else addLine([span(fmt(t('m_toneSet'), { v: TONE }), 'mut'), span('  ·  ' + t('m_toneUsage'), 'dim')]);
    }
});

cmd({
    name: 'sound', usage: 'sound [on|off]', group: 'prefs',
    desc: { en: I18N.en.c_sound, hi: I18N.hi.c_sound }, complete: () => ['on', 'off'],
    run(a) {
        const v = a[0];
        if (v === 'on' || v === 'off') setSound(v === 'on');
        else setSound(!Sound.enabled);
        addLine([span(Sound.enabled ? t('m_soundOn') : t('m_soundOff'), 'mut')]);
    }
});

cmd({
    name: 'minimize', group: 'prefs', desc: { en: I18N.en.c_minimize, hi: I18N.hi.c_minimize },
    run() { setMin(true); addLine([span(t('m_min'), 'dim')]); }
});
cmd({
    name: 'exit', group: 'prefs', desc: { en: I18N.en.c_exit, hi: I18N.hi.c_exit },
    run() { setMin(true); addLine([span(t('m_exit'), 'dim')]); }
});

/* ── fun ─────────────────────────────────────────────────────── */
cmd({
    name: 'game', group: 'fun', desc: { en: I18N.en.c_game, hi: I18N.hi.c_game },
    run() { addLine([span(t('m_gameIntro'), 'mut')]); Snake.open(); }
});

cmd({
    name: 'sudo', usage: 'sudo <anything>', group: 'fun',
    desc: { en: I18N.en.c_sudo, hi: I18N.hi.c_sudo },
    run() { Sound.err(); addLine([span(t('m_sudo'), 'err')]); }
});

/* ── section hubs — lists are read live from REG, not a hand-maintained menu ── */
function commandsInGroup(group) {
    const skip = new Set(group === 'prefs' ? ['preferences', 'prefs'] : [group]);
    return REG.filter(c => c.group === group && !c.hidden && !c.sectionHub && !skip.has(c.name));
}
function printGroupCommands(group) {
    commandsInGroup(group).forEach(c => {
        const d = el('div', 'ln hrow');
        d.appendChild(span(c.usage || c.name, 'usage'));
        d.appendChild(span(descOf(c), 'hdesc'));
        out.appendChild(d);
    });
    scroll();
}
function showSection(group) {
    section(t('g_' + group));
    addLine([span(t('m_sectionCmds'), 'mut')]);
    blank();
    printGroupCommands(group);
    blank();
    addLine([span(t('m_sectionHint'), 'dim')]);
}
cmd({
    name: 'general', group: 'general', sectionHub: true,
    desc: { en: I18N.en.c_general, hi: I18N.hi.c_general },
    run() { showSection('general'); }
});
cmd({
    name: 'profile', group: 'profile', sectionHub: true,
    desc: { en: I18N.en.c_profile, hi: I18N.hi.c_profile },
    run() { showSection('profile'); }
});
cmd({
    name: 'preferences', aliases: ['prefs'], group: 'prefs', sectionHub: true,
    desc: { en: I18N.en.c_preferences, hi: I18N.hi.c_preferences },
    run() { showSection('prefs'); }
});
cmd({
    name: 'fun', group: 'fun', sectionHub: true,
    desc: { en: I18N.en.c_fun, hi: I18N.hi.c_fun },
    run() { showSection('fun'); }
});

/* ══════════════════════════════════════════════════════════════
   MODULE: command parser + autocomplete + suggestions
   ══════════════════════════════════════════════════════════════ */
function suggestFor(input) {
    const scored = [];
    allNames().forEach(nm => {
        let d = lev(input, nm);
        if (nm.startsWith(input)) d -= 2;
        if (d <= 2) scored.push([d, nm]);
    });
    scored.sort((a, b) => a[0] - b[0]);
    return [...new Set(scored.map(s => s[1]))].slice(0, 3);
}
async function execute(raw) {
    echoLine(raw);
    const compact = raw.trim().replace(/\s+/g, ' ');
    if (!compact) { return; } // graceful empty-input handling
    History.push(compact);
    const low = compact.toLowerCase();
    let c = findCmd(low), args = []; // multi-word commands match first (e.g. "sim sim khul ja")
    //Isko Change kiya hai)(Add kia hai)
    // Allow direct project number commands
    if (/^\d+$/.test(low)) {
        const project = PROJECTS.find(p => p.id === Number(low));

        if (project) {
            Sound.exec();
            printProject(project);
            scroll();
            return;
        }
    }
    if (!c) {
        const first = low.split(' ')[0];
        c = findCmd(first);
        if (c) args = low.split(' ').slice(1);
    }
    if (!c) {
        Sound.err();
        addLine([span(fmt(tt('errUnknown'), { c: compact }), 'err')]);
        const s = suggestFor(low);
        if (s.length) addLine([span(t('suggest') + ' ', 'mut'), span(s.join('  ·  '), 'cy')]);
        addLine([span(t('typeHelp'), 'dim')]);
        return;
    }
    Sound.exec();
    try { await c.run(args, compact); }
    catch (err) { console.error(err); Sound.err(); addLine([span('✗ internal error — see console', 'err')]); }
    scroll();
}
function commonPrefix(arr) {
    let p = arr[0];
    for (const s of arr) { let i = 0; while (i < p.length && i < s.length && p[i] === s[i]) i++; p = p.slice(0, i); }
    return p;
}
function tabComplete() {
    const val = cmdInput.value;
    if (cmdInput.selectionStart !== val.length) return;
    const tokens = val.split(' ');
    if (tokens.length === 1) {
        const frag = tokens[0].toLowerCase();
        if (!frag) return;
        const matches = allNames().filter(n => n.startsWith(frag));
        if (!matches.length) return;
        if (matches.length === 1) { cmdInput.value = matches[0] + ' '; Sound.key(); }
        else {
            const cp = commonPrefix(matches);
            if (cp.length > frag.length) cmdInput.value = cp;
            addLine([span('  ' + matches.join('   '), 'dim')]);
            Sound.key();
        }
    } else {
        const first = tokens[0].toLowerCase();
        const c = findCmd(first), frag = tokens[tokens.length - 1].toLowerCase();
        const opts = (c && c.complete ? c.complete(tokens) : []).filter(o => o.startsWith(frag));
        if (opts.length === 1) { tokens[tokens.length - 1] = opts[0]; cmdInput.value = tokens.join(' ') + ' '; Sound.key(); }
        else if (opts.length > 1) addLine([span('  ' + opts.join('   '), 'dim')]);
    }
}

/* ══════════════════════════════════════════════════════════════
   MODULE: input wiring
   ══════════════════════════════════════════════════════════════ */
cmdInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); const v = cmdInput.value; cmdInput.value = ''; execute(v); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); History.up(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); History.down(); return; }
    if (e.key === 'Tab') { e.preventDefault(); tabComplete(); return; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { Sound.unlock(); Sound.key(); }
});
tbody.addEventListener('click', e => {
    if (e.target.closest('a,button')) return;               // don't fight real controls
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;                       // user is selecting text
    cmdInput.focus({ preventScroll: true });
});

/* quick-command chips (mobile-first, hidden on desktop) */
['help', 'whoami', 'skills', 'projects', 'experience', 'education', 'contact', 'game'].forEach(name => {
    const b = el('button', 'chipbtn'); b.type = 'button'; b.textContent = name;
    b.addEventListener('click', () => { Sound.unlock(); execute(name); cmdInput.focus({ preventScroll: true }); });
    $('#chipsBar').appendChild(b);
});

/* ══════════════════════════════════════════════════════════════
   MODULE: header controls — theme, sound, language, minimize
   ══════════════════════════════════════════════════════════════ */
function setSound(on) {
    Sound.enabled = on; store.set('cv-sound', on ? 'on' : 'off');
    const b = $('#btnSound');
    b.dataset.off = on ? '0' : '1';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) { Sound.unlock(); Sound.ok(); }
}
function setLang(l) {
    LANG = l; store.set('cv-lang', l); applyI18nStatic();
}
function setMin(v) {
    const term = $('#terminal');
    term.classList.toggle('min', v);
    $('#thead').setAttribute('aria-expanded', v ? 'false' : 'true');
    $('#shellStatus').textContent = v ? t('m_minStatus') : t('status');
    if (v) cmdInput.blur(); else cmdInput.focus({ preventScroll: true });
    Sound.click();
}
$('#thead').addEventListener('click', () => { if ($('#terminal').classList.contains('min')) setMin(false); });
$('#btnMin').addEventListener('click', e => { e.stopPropagation(); setMin(!$('#terminal').classList.contains('min')); });
$('#btnTheme').addEventListener('click', e => { e.stopPropagation(); toggleTheme(); });
$('#btnSound').addEventListener('click', e => {
    e.stopPropagation(); setSound(!Sound.enabled);
    addLine([span(Sound.enabled ? t('m_soundOn') : t('m_soundOff'), 'mut')]);
});
$('#btnLang').addEventListener('click', e => {
    e.stopPropagation();
    setLang(LANG === 'en' ? 'hi' : 'en');
    addLine([span(fmt(t('m_langSet'), { v: LANG === 'hi' ? 'हिन्दी' : 'English' }), 'mut')]); Sound.click();
});

function applyI18nStatic() {
    document.documentElement.lang = LANG === 'hi' ? 'hi' : 'en';
    $('#shellStatus').textContent = $('#terminal').classList.contains('min') ? t('m_minStatus') : t('status');
    $('#footerHint').textContent = t('footerHint');
    $('#gHint').textContent = t('g_hint');
    $('#gScoreLbl').textContent = t('g_score');
    $('#gBestLbl').textContent = t('g_best');
    $('#btnLang').textContent = LANG === 'en' ? 'हिं' : 'EN';
    $('#btnLang').setAttribute('aria-label', t('a_lang'));
    $('#btnTheme').setAttribute('aria-label', t('a_theme'));
    $('#btnSound').setAttribute('aria-label', t('a_sound'));
    $('#btnMin').setAttribute('aria-label', t('a_min'));
}

/* ══════════════════════════════════════════════════════════════
   MODULE: rotating title (footer) — typing / erasing loop
   ══════════════════════════════════════════════════════════════ */
function startRotator() {
    const target = $('#rotTitle'), titles = PROFILE.titles;
    if (RM) { target.textContent = titles[titles.length - 1]; return; }
    let i = 0, len = 0, dir = 1;
    (function tick() {
        const full = titles[i];
        len += dir; target.textContent = full.slice(0, len);
        let delay = dir > 0 ? 55 : 26;
        if (dir > 0 && len === full.length) { dir = -1; delay = 1900; }
        else if (dir < 0 && len === 0) { dir = 1; i = (i + 1) % titles.length; delay = 280; }
        setTimeout(tick, delay);
    })();
}

/* ══════════════════════════════════════════════════════════════
   MODULE: welcome + boot sequence
   ══════════════════════════════════════════════════════════════ */
function welcome() {
    printBanner(); blank();
    addLine([span('“' + PROFILE.tagline + '”', 'cy')]);
    addLine([span(t('welcome'), 'b')]);
    addLine([span(t('typeHelp'), 'mut')]);
    addLine([span(t('typeSections'), 'mut')]); blank();
    addLine([span(t('tipTab'), 'dim')]);
}
function runBoot() {
    const boot = $('#boot'), log = $('#bootLog'), fill = $('#bootFill');
    const lines = [t('boot1'), t('boot2'), t('boot3'), t('boot4'), t('boot5'), t('boot6')];
    $('#bootSkip').textContent = t('bootSkip');
    let done = false; const timers = [];
    const finish = () => {
        if (done) return; done = true;
        timers.forEach(clearTimeout);
        boot.classList.add('boot-out');
        setTimeout(() => boot.remove(), 400);
        startRotator(); welcome();
        cmdInput.focus({ preventScroll: true });
    };
    lines.forEach((txt, i) => {
        timers.push(setTimeout(() => {
            const row = el('div', 'brow');
            row.appendChild(span('[ ' + (0.12 + i * 0.31 + Math.random() * 0.05).toFixed(3) + ' ]', 'btime'));
            row.appendChild(span(txt + '  '));
            log.appendChild(row);
            timers.push(setTimeout(() => row.appendChild(span('[ OK ]', 'bok')), RM ? 20 : 200));
            fill.style.width = ((i + 1) / lines.length * 100) + '%';
            if (i === lines.length - 1) timers.push(setTimeout(finish, RM ? 60 : 420));
        }, RM ? i * 50 : i * 330));
    });
    const skip = e => { Sound.unlock(); finish(); };
    boot.addEventListener('pointerdown', skip, { once: true });
    addEventListener('keydown', skip, { once: true });
}

/* ══════════════════════════════════════════════════════════════
   MODULE: games/snake — canvas, no dependencies
   ══════════════════════════════════════════════════════════════ */
const Snake = (() => {
    const N = 20, cv = $('#gameCanvas'), ctx = cv.getContext('2d');
    const overlay = $('#gameOverlay'), scoreEl = $('#gScore'), bestEl = $('#gBest');
    let cell = 17, snake, dir, pend, food, score = 0, state = 'idle', timer = null, speed = 150, newBest = false;
    let best = parseInt(store.get('cv-snake-best', '0'), 10) || 0;
    bestEl.textContent = best;
    const px = n => n * cell;

    function resize() {
        const w = cv.clientWidth, dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = w * dpr; cv.height = w * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cell = w / N;
    }
    function reset() {
        snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
        dir = { x: 1, y: 0 }; pend = []; score = 0; speed = 150; newBest = false;
        scoreEl.textContent = '0'; placeFood();
    }
    function placeFood() {
        do { food = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 }; }
        while (snake.some(s => s.x === food.x && s.y === food.y));
    }
    function schedule() { clearInterval(timer); timer = setInterval(step, speed); }
    function start() { state = 'run'; schedule(); draw(); }
    function step() {
        if (pend.length) dir = pend.shift();
        const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some(s => s.x === h.x && s.y === h.y)) return over();
        snake.unshift(h);
        if (h.x === food.x && h.y === food.y) {
            score += 10; scoreEl.textContent = score; Sound.eat();
            speed = Math.max(70, speed - 2); schedule(); placeFood();
        } else snake.pop();
        draw();
    }
    function over() {
        state = 'over'; clearInterval(timer); Sound.over();
        if (score > best) { best = score; store.set('cv-snake-best', String(best)); bestEl.textContent = best; newBest = true; }
        draw();
    }
    function togglePause() {
        if (state === 'run') { state = 'paused'; clearInterval(timer); draw(); Sound.click(); }
        else if (state === 'paused') { state = 'run'; schedule(); draw(); Sound.click(); }
    }
    function restart() { reset(); state = 'ready'; draw(); Sound.click(); }
    function open() { overlay.hidden = false; resize(); reset(); state = 'ready'; draw(); Sound.click(); cmdInput.blur(); }
    function close() { overlay.hidden = true; state = 'idle'; clearInterval(timer); cmdInput.focus({ preventScroll: true }); }
    function steer(x, y) {
        if (state === 'ready') start();
        if (state !== 'run') return;
        const last = pend.length ? pend[pend.length - 1] : dir;
        if ((x === -last.x && y === -last.y) || (x === last.x && y === last.y)) return;
        pend.push({ x, y }); if (pend.length > 3) pend.shift();
        Sound.turn();
    }
    function rr(x, y, w, h, r) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
    }
    function draw() {
        const w = cv.clientWidth;
        ctx.fillStyle = '#0A0C10'; ctx.fillRect(0, 0, w, w);
        ctx.strokeStyle = 'rgba(148,163,184,.07)'; ctx.lineWidth = 1;
        for (let i = 1; i < N; i++) {
            ctx.beginPath(); ctx.moveTo(px(i) + .5, 0); ctx.lineTo(px(i) + .5, w); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, px(i) + .5); ctx.lineTo(w, px(i) + .5); ctx.stroke();
        }
        ctx.fillStyle = '#22D3EE'; rr(px(food.x) + 3, px(food.y) + 3, cell - 6, cell - 6, 4); ctx.fill();
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#86EFAC' : '#22C55E';
            rr(px(s.x) + 1.5, px(s.y) + 1.5, cell - 3, cell - 3, Math.max(3, cell * .22)); ctx.fill();
        });
        if (state !== 'run') overlayText(w);
    }
    function overlayText(w) {
        ctx.fillStyle = 'rgba(8,9,11,.75)'; ctx.fillRect(0, 0, w, w);
        ctx.textAlign = 'center'; const F = '"JetBrains Mono",monospace';
        if (state === 'ready') {
            ctx.fillStyle = '#E5E7EB'; ctx.font = '600 13px ' + F; ctx.fillText(t('g_ready1'), w / 2, w / 2 - 8);
            ctx.fillStyle = '#9CA3AF'; ctx.font = '11px ' + F; ctx.fillText(t('g_ready2'), w / 2, w / 2 + 14);
        } else if (state === 'paused') {
            ctx.fillStyle = '#FBBF24'; ctx.font = '600 13px ' + F; ctx.fillText(t('g_paused'), w / 2, w / 2);
        } else if (state === 'over') {
            ctx.fillStyle = '#F87171'; ctx.font = '700 20px ' + F; ctx.fillText(t('g_over'), w / 2, w / 2 - 28);
            ctx.fillStyle = '#E5E7EB'; ctx.font = '12px ' + F; ctx.fillText(fmt(t('g_overSub'), { s: score }), w / 2, w / 2 + 2);
            if (newBest) { ctx.fillStyle = '#22C55E'; ctx.fillText(t('g_newBest'), w / 2, w / 2 + 26); }
        }
    }
    // keys are captured globally while the game is open — terminal stays untouched
    addEventListener('keydown', e => {
        if (overlay.hidden) return;
        const k = e.key.toLowerCase();
        const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
        if (map[k]) { e.preventDefault(); steer(map[k][0], map[k][1]); }
        else if (k === ' ') { e.preventDefault(); state === 'ready' ? start() : togglePause(); }
        else if (k === 'p') togglePause();
        else if (k === 'escape') close();
        else if (k === 'enter' || k === 'r') { if (state === 'over' || state === 'ready') restart(); }
    }, true);
    // touch: swipe on canvas + on-screen d-pad
    let ts = null;
    cv.addEventListener('touchstart', e => { ts = e.touches[0]; e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchmove', e => {
        if (!ts) return;
        const c = e.touches[0], dx = c.clientX - ts.clientX, dy = c.clientY - ts.clientY;
        if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
            Math.abs(dx) > Math.abs(dy) ? steer(Math.sign(dx), 0) : steer(0, Math.sign(dy)); ts = c;
        }
        e.preventDefault();
    }, { passive: false });
    cv.addEventListener('touchend', () => { ts = null; });
    cv.addEventListener('click', () => { if (state === 'ready') start(); });
    const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    document.querySelectorAll('.dp').forEach(b => {
        b.addEventListener('pointerdown', e => { e.preventDefault(); steer(...DIR[b.dataset.dir]); });
    });
    $('#gPause').addEventListener('click', () => { state === 'ready' ? start() : togglePause(); });
    $('#gRestart').addEventListener('click', restart);
    $('#gClose').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    addEventListener('resize', () => { if (!overlay.hidden) { resize(); draw(); } });

    return { open, close, steer, togglePause, restart, get state() { return state } };
})();

/* ══════════════════════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════════════════════ */
applyTheme(curTheme());
setSound(Sound.enabled); // sync button state without playing a chime yet
$('#btnSound').dataset.off = Sound.enabled ? '0' : '1';
applyI18nStatic();
runBoot();

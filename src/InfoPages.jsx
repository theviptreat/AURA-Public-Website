import React from 'react';
import { localizePath } from './i18n/locale';
import { getPublishedArticles } from './content/articles.js';
import { localizeStory } from './i18n/localized-content.js';

const tr = (locale, en, hi) => locale === 'hi' ? hi : en;

const categoryPages = {
  '/match-preview': {
    section: 'match-preview',
    eyebrow: ['Before the first ball', 'पहली गेंद से पहले'],
    title: ['Match Previews', 'मैच पूर्वावलोकन'],
    description: ['Build context around the fixtures ahead with considered previews and key points to watch.', 'आने वाले मैचों को बेहतर समझें। हर मुकाबले के अहम पहलुओं और देखने योग्य बातों के साथ।'],
    empty: ['Match previews will appear here when they are published.', 'मैच पूर्वावलोकन प्रकाशित होने पर यहाँ दिखाई देंगे।']
  },
  '/analysis': {
    section: 'analysis',
    eyebrow: ['Look beyond the score', 'स्कोर से आगे की समझ'],
    title: ['AURA Sports Analysis', 'AURA Sports विश्लेषण'],
    description: ['Thoughtful cricket analysis, patterns and perspectives from the AURA Sports editorial team.', 'AURA Sports की संपादकीय टीम द्वारा क्रिकेट का गहन विश्लेषण, खेल के पैटर्न और उपयोगी दृष्टिकोण।'],
    empty: ['AURA Sports analysis articles will appear here when they are published.', 'AURA Sports के विश्लेषण लेख प्रकाशित होने पर यहाँ दिखाई देंगे।']
  },
  '/knowledge': {
    section: 'knowledge',
    eyebrow: ['Understand the game', 'खेल को समझें'],
    title: ['Cricket Knowledge', 'क्रिकेट ज्ञान'],
    description: ['Clear explanations of cricket rules, formats, tactics and the details that make the game fascinating.', 'क्रिकेट के नियमों, प्रारूपों, रणनीतियों और खेल को दिलचस्प बनाने वाली बारीकियों की आसान जानकारी।'],
    empty: ['Cricket knowledge articles will appear here when they are published.', 'क्रिकेट से जुड़ी जानकारी वाले लेख प्रकाशित होने पर यहाँ दिखाई देंगे।']
  }
};

function PageHero({ eyebrow, title, description }) {
  return <section className="page-hero"><div className="container"><span className="eyebrow eyebrow-light">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>;
}

function EditorialCategoryPage({ path, locale }) {
  const page = categoryPages[path];
  const stories = getPublishedArticles()
    .filter((article) => article.section === page.section)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map((article) => localizeStory(article, locale));
  return (
    <main className="page-main">
      <PageHero eyebrow={page.eyebrow[locale === 'hi' ? 1 : 0]} title={page.title[locale === 'hi' ? 1 : 0]} description={page.description[locale === 'hi' ? 1 : 0]} />
      <section className="container listing-section">
        {stories.length > 0 ? (
          <div className="news-list-grid">
            {stories.map((story) => (
              <article className="story-card" key={story.slug}>
                <a href={localizePath('/news/' + story.slug, locale)} className="story-card-link">
                  {story.coverImage ? <img className="story-image" src={story.coverImage} alt={story.coverAlt || story.title} loading="lazy" /> : <div className="story-image story-image-empty" aria-hidden="true" />}
                  <span className="story-category">{story.category}</span>
                  <h3>{story.title}</h3>
                  {story.excerpt && <p>{story.excerpt}</p>}
                  <time dateTime={story.publishedAt}>{story.dateLabel || story.publishedAt?.slice(0, 10)}</time>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="info-empty"><span className="empty-symbol" aria-hidden="true">✳</span><p>{page.empty[locale === 'hi' ? 1 : 0]}</p><a className="text-link" href={localizePath('/news', locale)}>{tr(locale, 'Explore all news', 'सभी खबरें देखें')} ↗</a></div>
        )}
      </section>
    </main>
  );
}

function AboutPage({ locale }) {
  return <main className="page-main">
    <PageHero eyebrow={tr(locale, 'The thinking behind AURA', 'AURA के पीछे की सोच')} title={tr(locale, 'About AURA', 'AURA के बारे में')} description={tr(locale, 'More than cricket. A deeper perspective.', 'क्रिकेट से बढ़कर। खेल को समझने का एक गहरा नज़रिया।')} />
    <section className="container info-content"><div className="info-copy">
      <span className="eyebrow">{tr(locale, 'Our perspective', 'हमारा नज़रिया')}</span>
      <h2>{tr(locale, 'More than just a game', 'सिर्फ एक खेल से कहीं बढ़कर')}</h2>
      <p>{tr(locale, 'Cricket is a game of skill, strategy, patience and possibilities.', 'क्रिकेट कौशल, रणनीति, धैर्य और संभावनाओं का खेल है।')}</p>
      <p>{tr(locale, 'At AURA, we believe understanding the game takes more than just watching it. It takes observation, research, patience and the ability to see beyond the obvious.', 'AURA में हमारा मानना है कि खेल को समझने के लिए सिर्फ उसे देखना काफी नहीं। इसके लिए निरीक्षण, शोध, धैर्य और स्पष्ट दिखाई देने वाली बातों से आगे देखने की क्षमता चाहिए।')}</p>
      <p>{tr(locale, 'Built for those who appreciate the deeper side of cricket, AURA brings a thoughtful perspective to the game.', 'उन लोगों के लिए जो क्रिकेट की गहराई को समझते हैं, AURA खेल को देखने का एक विचारशील नज़रिया लेकर आता है।')}</p>
    </div><div className="info-highlight"><span className="eyebrow eyebrow-light">{tr(locale, 'Beyond the Game', 'खेल से कहीं आगे')}</span><h2>{tr(locale, 'Skill. Strategy. Patience.', 'कौशल। रणनीति। धैर्य।')}</h2><p>{tr(locale, 'A considered cricket perspective, shaped by observation, research and patience.', 'निरीक्षण, शोध और धैर्य से तैयार किया गया क्रिकेट को देखने का विचारशील नज़रिया।')}</p></div></section>
  </main>;
}

function ContactPage({ locale }) {
  return <main className="page-main">
    <PageHero eyebrow={tr(locale, "We're here to help", 'हम आपकी सहायता के लिए हैं')} title={tr(locale, 'Contact & Help', 'संपर्क और सहायता')} description={tr(locale, 'For questions about AURA Sports, its content or the app, this is the place to start.', 'AURA Sports, इसकी सामग्री या ऐप से जुड़े सवालों के लिए यहाँ से शुरुआत करें।')} />
    <section className="container info-content contact-content"><div className="info-copy"><span className="eyebrow">{tr(locale, 'Get in touch', 'संपर्क करें')}</span><h2>{tr(locale, 'How can we help?', 'हम आपकी क्या मदद कर सकते हैं?')}</h2>
      <p>{tr(locale, 'Choose the right email address and our team will be able to direct your enquiry.', 'अपनी आवश्यकता के अनुसार सही ईमेल चुनें, हमारी टीम आपकी बात संबंधित विभाग तक पहुँचा सकेगी।')}</p>
    </div><div className="contact-email-list">
      <div className="contact-email-card"><span className="eyebrow">{tr(locale, 'BUSINESS ENQUIRIES', 'व्यावसायिक पूछताछ')}</span><a href="mailto:business.aurasports@gmail.com">business.aurasports@gmail.com</a></div>
      <div className="contact-email-card"><span className="eyebrow">{tr(locale, 'CUSTOMER SUPPORT', 'ग्राहक सहायता')}</span><a href="mailto:customercare.aurasports@gmail.com">customercare.aurasports@gmail.com</a></div>
    </div></section>
  </main>;
}

const legalPages = {
  '/privacy-policy': {
    title: ['Privacy Policy', 'गोपनीयता नीति'],
    eyebrow: ['Your privacy', 'आपकी गोपनीयता'],
    description: ['How information may be processed when you visit the AURA website.', 'AURA वेबसाइट पर आने के दौरान जानकारी को कैसे प्रोसेस किया जा सकता है।'],
    lastUpdated: ['Last Updated: 17 November 2026', 'अंतिम अपडेट: 17 नवंबर 2026'],
    sections: [
      { heading: ['1. About This Website', '1. इस वेबसाइट के बारे में'], paragraphs: [
        ['AURA (“we”, “our” or “us”) respects your privacy. This Privacy Policy explains how information may be processed when you visit the AURA website.', 'AURA (“हम”, “हमारा” या “हमें”) आपकी गोपनीयता का सम्मान करता है। यह गोपनीयता नीति बताती है कि AURA वेबसाइट पर आने के दौरान जानकारी को कैसे प्रोसेस किया जा सकता है।'],
        ['AURA is currently an independently operated brand managed by its founder and is not a separately incorporated company.', 'AURA फिलहाल अपने संस्थापक द्वारा संचालित एक स्वतंत्र ब्रांड है और अलग से पंजीकृत कंपनी नहीं है।'],
        ['The AURA website currently serves as an informational landing page. It does not offer user registration, login accounts, membership services, online purchases, payments or contact forms.', 'AURA वेबसाइट फिलहाल एक जानकारी देने वाले लैंडिंग पेज के रूप में काम करती है। इस पर यूज़र रजिस्ट्रेशन, लॉगिन अकाउंट, सदस्यता सेवाएँ, ऑनलाइन खरीदारी, भुगतान या संपर्क फ़ॉर्म उपलब्ध नहीं हैं।']
      ]},
      { heading: ['2. Information We Collect', '2. हम कौन-सी जानकारी एकत्र करते हैं'], paragraphs: [
        ['AURA does not currently ask visitors to submit personal information through website forms or account features.', 'AURA फिलहाल वेबसाइट फ़ॉर्म या अकाउंट सुविधाओं के माध्यम से आगंतुकों से व्यक्तिगत जानकारी जमा करने के लिए नहीं कहता।'],
        ['Certain technical information may be processed automatically by website hosting and infrastructure providers when you visit the website. This may include:', 'वेबसाइट पर आने के दौरान होस्टिंग और इन्फ्रास्ट्रक्चर प्रदाता कुछ तकनीकी जानकारी को अपने आप प्रोसेस कर सकते हैं। इसमें शामिल हो सकता है:']
      ], bullets: {
        en: ['IP address', 'Browser and device information', 'Technical request information', 'Security and diagnostic information'],
        hi: ['IP एड्रेस', 'ब्राउज़र और डिवाइस की जानकारी', 'तकनीकी रिक्वेस्ट से जुड़ी जानकारी', 'सुरक्षा और समस्या-जाँच से जुड़ी जानकारी']
      }, closing: ['Such processing may be necessary to deliver, maintain and protect the website.', 'वेबसाइट उपलब्ध कराने, बनाए रखने और सुरक्षित रखने के लिए ऐसी प्रोसेसिंग आवश्यक हो सकती है।']},
      { heading: ['3. Information You Send to Us', '3. आपके द्वारा भेजी गई जानकारी'], paragraphs: [
        ['If you contact AURA directly by email, we may receive information you choose to provide, such as your email address, name and message.', 'यदि आप AURA से सीधे ईमेल के माध्यम से संपर्क करते हैं, तो हमें आपके द्वारा दी गई जानकारी मिल सकती है, जैसे आपका ईमेल पता, नाम और संदेश।'],
        ['We use this information to understand and respond to your communication and to maintain relevant correspondence where necessary.', 'हम इस जानकारी का उपयोग आपके संदेश को समझने और उसका जवाब देने तथा आवश्यकता होने पर संबंधित पत्राचार का रिकॉर्ड रखने के लिए करते हैं।'],
        ['Please avoid sending sensitive personal information unless it is genuinely necessary.', 'जब तक वास्तव में आवश्यक न हो, कृपया संवेदनशील व्यक्तिगत जानकारी न भेजें।']
      ]},
      { heading: ['4. Cookies and Tracking Technologies', '4. कुकीज़ और ट्रैकिंग तकनीक'], paragraphs: [
        ['AURA does not currently use website analytics or advertising-tracking tools.', 'AURA फिलहाल वेबसाइट एनालिटिक्स या विज्ञापन ट्रैकिंग टूल का उपयोग नहीं करता।'],
        ['We do not intentionally use tracking technologies for advertising profiling or behavioural monitoring.', 'हम विज्ञापन प्रोफाइलिंग या व्यवहार की निगरानी के लिए जानबूझकर ट्रैकिंग तकनीकों का उपयोग नहीं करते।'],
        ['However, hosting and infrastructure services may use technical mechanisms necessary for website delivery, security and operation. Their own privacy policies may apply to such processing.', 'हालाँकि, होस्टिंग और इन्फ्रास्ट्रक्चर सेवाएँ वेबसाइट उपलब्ध कराने, सुरक्षा और संचालन के लिए आवश्यक तकनीकी तरीकों का उपयोग कर सकती हैं। ऐसी प्रोसेसिंग पर उनकी अपनी गोपनीयता नीतियाँ लागू हो सकती हैं।']
      ]},
      { heading: ['5. Third-Party Services and External Links', '5. थर्ड-पार्टी सेवाएँ और बाहरी लिंक'], paragraphs: [
        ['The AURA website uses third-party hosting infrastructure to make the website available. These providers may process technical information in accordance with their own privacy policies and applicable service terms.', 'AURA वेबसाइट को उपलब्ध कराने के लिए थर्ड-पार्टी होस्टिंग इन्फ्रास्ट्रक्चर का उपयोग करती है। ये प्रदाता अपनी गोपनीयता नीतियों और लागू सेवा शर्तों के अनुसार तकनीकी जानकारी प्रोसेस कर सकते हैं।'],
        ['The website may also contain links to external websites. When you visit those websites, their respective privacy policies and terms apply. AURA does not control the privacy practices of independent third-party websites.', 'वेबसाइट पर बाहरी वेबसाइटों के लिंक भी हो सकते हैं। उन वेबसाइटों पर जाने के बाद उनकी अपनी गोपनीयता नीतियाँ और शर्तें लागू होंगी। स्वतंत्र थर्ड-पार्टी वेबसाइटों की गोपनीयता प्रक्रियाओं पर AURA का नियंत्रण नहीं है।']
      ]},
      { heading: ['6. How Information Is Used', '6. जानकारी का उपयोग कैसे किया जाता है'], paragraphs: [
        ['Information received through direct email communication or processed by website infrastructure may be used for the following purposes:', 'सीधे ईमेल के माध्यम से प्राप्त या वेबसाइट इन्फ्रास्ट्रक्चर द्वारा प्रोसेस की गई जानकारी का उपयोग इन उद्देश्यों के लिए किया जा सकता है:']
      ], bullets: {
        en: ['Responding to enquiries', 'Maintaining website availability', 'Protecting the website against misuse and security threats', 'Diagnosing technical issues', 'Complying with applicable legal obligations'],
        hi: ['पूछताछ का जवाब देना', 'वेबसाइट की उपलब्धता बनाए रखना', 'दुरुपयोग और सुरक्षा खतरों से वेबसाइट की रक्षा करना', 'तकनीकी समस्याओं की जाँच करना', 'लागू कानूनी दायित्वों का पालन करना']
      }, closing: ['AURA does not sell visitors’ personal information.', 'AURA आगंतुकों की व्यक्तिगत जानकारी नहीं बेचता।']},
      { heading: ['7. Sharing of Information', '7. जानकारी साझा करना'], paragraphs: [
        ['AURA does not sell visitors’ personal information.', 'AURA आगंतुकों की व्यक्तिगत जानकारी नहीं बेचता।'],
        ['Information may be processed by hosting and infrastructure providers where necessary to operate and secure the website. Information may also be disclosed where required by applicable law or a lawful government request.', 'वेबसाइट के संचालन और सुरक्षा के लिए आवश्यक होने पर होस्टिंग और इन्फ्रास्ट्रक्चर प्रदाता जानकारी प्रोसेस कर सकते हैं। लागू कानून या किसी वैध सरकारी अनुरोध के तहत भी जानकारी साझा की जा सकती है।']
      ]},
      { heading: ['8. Data Security and Retention', '8. डेटा सुरक्षा और उसे रखने की अवधि'], paragraphs: [
        ['We take reasonable steps appropriate to the nature of the website to protect information handled directly by AURA.', 'AURA द्वारा सीधे संभाली जाने वाली जानकारी की सुरक्षा के लिए हम वेबसाइट की प्रकृति के अनुरूप उचित कदम उठाते हैं।'],
        ['Information received through email may be retained for as long as reasonably necessary to respond to the communication, maintain relevant records or meet legal obligations.', 'ईमेल से प्राप्त जानकारी को संदेश का जवाब देने, संबंधित रिकॉर्ड रखने या कानूनी दायित्वों को पूरा करने के लिए उचित रूप से आवश्यक अवधि तक रखा जा सकता है।'],
        ['Technical information handled by third-party infrastructure providers is subject to their applicable retention practices and policies.', 'थर्ड-पार्टी इन्फ्रास्ट्रक्चर प्रदाताओं द्वारा संभाली जाने वाली तकनीकी जानकारी उनकी लागू डेटा-रिटेंशन प्रक्रियाओं और नीतियों के अधीन होगी।']
      ]},
      { heading: ['9. Your Privacy Choices and Requests', '9. आपकी गोपनीयता संबंधी पसंद और अनुरोध'], paragraphs: [
        ['You can choose not to provide personal information to AURA through direct email communication.', 'आप सीधे ईमेल के माध्यम से AURA को व्यक्तिगत जानकारी न देने का विकल्प चुन सकते हैं।'],
        ['If you have a privacy-related question or request concerning information you have shared with AURA, you can contact us using the email address provided below. We will consider such requests in accordance with applicable law.', 'यदि AURA के साथ साझा की गई जानकारी के संबंध में आपका कोई गोपनीयता-संबंधी प्रश्न या अनुरोध है, तो नीचे दिए गए ईमेल पते पर संपर्क करें। हम ऐसे अनुरोधों पर लागू कानून के अनुसार विचार करेंगे।']
      ]},
      { heading: ['10. Children’s Privacy', '10. बच्चों की गोपनीयता'], paragraphs: [
        ['The AURA website is a general informational landing page and does not currently offer account registration or forms for collecting visitor information.', 'AURA वेबसाइट एक सामान्य जानकारी देने वाला लैंडिंग पेज है और फिलहाल अकाउंट रजिस्ट्रेशन या आगंतुकों की जानकारी एकत्र करने वाले फ़ॉर्म उपलब्ध नहीं कराती।'],
        ['We do not intentionally request personal information from children through the website.', 'हम वेबसाइट के माध्यम से जानबूझकर बच्चों से व्यक्तिगत जानकारी नहीं माँगते।']
      ]},
      { heading: ['11. Changes to This Privacy Policy', '11. इस गोपनीयता नीति में बदलाव'], paragraphs: [
        ['We may update this Privacy Policy when the website, its features or applicable legal requirements change.', 'वेबसाइट, उसकी सुविधाओं या लागू कानूनी आवश्यकताओं में बदलाव होने पर हम इस गोपनीयता नीति को अपडेट कर सकते हैं।'],
        ['Any revised version will be published on this page with an updated “Last Updated” date.', 'संशोधित नीति इसी पेज पर नई “Last Updated” तारीख के साथ प्रकाशित की जाएगी।']
      ]},
      { heading: ['12. Contact Us', '12. हमसे संपर्क करें'], paragraphs: [
        ['For privacy-related questions, concerns or requests, please contact:', 'गोपनीयता से जुड़े प्रश्नों, चिंताओं या अनुरोधों के लिए संपर्क करें:'],
        ['Email: customercare.aurasports@gmail.com', 'ईमेल: customercare.aurasports@gmail.com']
      ]}
    ]
  },
  '/terms': {
    title: ['Terms & Conditions', 'नियम और शर्तें'],
    eyebrow: ['Using AURA Sports', 'AURA Sports का उपयोग'],
    description: ['The terms that will govern access to the AURA Sports public website and its content.', 'AURA Sports की सार्वजनिक वेबसाइट और उसकी सामग्री के उपयोग पर लागू होने वाली शर्तें।'],
    notice: ['Draft page — not published terms.', 'मसौदा पृष्ठ — ये प्रकाशित नियम और शर्तें नहीं हैं।'],
    sections: [
      [['Before publication', 'प्रकाशन से पहले'], ['The final terms must be reviewed and approved by AURA Sports and should accurately describe permitted use, intellectual property, content availability, third-party links, limitations and applicable legal requirements.', 'अंतिम शर्तों की AURA Sports द्वारा समीक्षा और स्वीकृति आवश्यक है। इनमें अनुमत उपयोग, बौद्धिक संपदा, सामग्री की उपलब्धता, तृतीय-पक्ष लिंक, सीमाएँ और लागू कानूनी आवश्यकताएँ सही रूप में बताई जानी चाहिए।']],
      [['Informational content', 'जानकारीपरक सामग्री'], ['AURA Sports editorial content is provided for general information and cricket discussion. Any final terms must clearly distinguish editorial material from app features and predictions.', 'AURA Sports की संपादकीय सामग्री सामान्य जानकारी और क्रिकेट चर्चा के लिए है। अंतिम शर्तों में संपादकीय सामग्री, ऐप की सुविधाओं और पूर्वानुमानों के बीच स्पष्ट अंतर होना चाहिए।']]
    ]
  },
  '/disclaimer': {
    title: ['Disclaimer', 'अस्वीकरण'],
    eyebrow: ['Important information', 'महत्वपूर्ण जानकारी'],
    description: ['How to understand the information and opinions published by AURA Sports.', 'AURA Sports द्वारा प्रकाशित जानकारी और विचारों को समझने के लिए आवश्यक विवरण।'],
    notice: ['Draft page — final wording requires review.', 'मसौदा पृष्ठ — अंतिम भाषा की समीक्षा आवश्यक है।'],
    sections: [
      [['Editorial content', 'संपादकीय सामग्री'], ['Cricket news, previews, analysis and educational material are published for general information. Match conditions and information can change, and readers should verify time-sensitive details with appropriate official sources.', 'क्रिकेट समाचार, पूर्वावलोकन, विश्लेषण और शैक्षिक सामग्री सामान्य जानकारी के लिए प्रकाशित की जाती है। मैच की परिस्थितियाँ और जानकारी बदल सकती हैं। समय-संवेदनशील विवरणों की पुष्टि उचित आधिकारिक स्रोतों से करें।']],
      [['Predictions', 'पूर्वानुमान'], ['AURA Sports predictions are team-researched opinions, not guarantees of an outcome. No claim of guaranteed accuracy or certainty is made.', 'AURA Sports के पूर्वानुमान टीम द्वारा शोध के आधार पर तैयार किए गए विचार हैं, किसी परिणाम की गारंटी नहीं। शत-प्रतिशत सटीकता या निश्चितता का कोई दावा नहीं किया जाता।']],
      [['Not betting advice', 'सट्टेबाज़ी संबंधी सलाह नहीं'], ['AURA Sports is a cricket content and prediction platform, not a betting service. Content should not be treated as encouragement to gamble or as financial advice.', 'AURA Sports क्रिकेट सामग्री और पूर्वानुमान का मंच है, सट्टेबाज़ी सेवा नहीं। इसकी सामग्री को जुआ खेलने के प्रोत्साहन या वित्तीय सलाह के रूप में न लें।']]
    ]
  }
};

function LegalPage({ path, locale }) {
  const page = legalPages[path];
  const index = locale === 'hi' ? 1 : 0;
  return <main className="page-main"><PageHero eyebrow={page.eyebrow[index]} title={page.title[index]} description={page.description[index]} /><section className="container legal-content">{page.lastUpdated && <p className="legal-updated">{page.lastUpdated[index]}</p>}{page.notice && <div className="draft-notice">{page.notice[index]}</div>}{page.sections.map((section) => {
    if (Array.isArray(section)) {
      const [heading, body] = section;
      return <section className="legal-section" key={heading[0]}><h2>{heading[index]}</h2><p>{body[index]}</p></section>;
    }
    return <section className="legal-section" key={section.heading[0]}><h2>{section.heading[index]}</h2>{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph[index]}</p>)}{section.bullets && <ul>{section.bullets[index === 0 ? 'en' : 'hi'].map((item) => <li key={item}>{item}</li>)}</ul>}{section.closing && <p>{section.closing[index]}</p>}</section>;
  })}</section></main>;
}

function DownloadPage({ locale }) {
  return <main className="page-main">
    <PageHero eyebrow={tr(locale, 'Take AURA Sports with you', 'AURA Sports को अपने साथ रखें')} title={tr(locale, 'Get the AURA Sports App', 'AURA Sports ऐप प्राप्त करें')} description={tr(locale, "AURA Sports's app is where match coverage and team-researched predictions come together.", 'AURA Sports ऐप पर मैच कवरेज और टीम द्वारा शोध के आधार पर तैयार किए गए पूर्वानुमान एक साथ मिलेंगे।')} />
    <section className="container info-content download-content"><div className="info-copy"><span className="eyebrow">{tr(locale, 'Coming soon', 'जल्द उपलब्ध होगा')}</span><h2>{tr(locale, 'The app download link will be available here.', 'ऐप डाउनलोड करने का लिंक यहाँ उपलब्ध होगा।')}</h2><p>{tr(locale, 'We will publish the official download option once the public release is ready. Use only the official AURA Sports link when it becomes available.', 'सार्वजनिक रिलीज़ तैयार होने पर हम डाउनलोड का आधिकारिक विकल्प प्रकाशित करेंगे। उपलब्ध होने पर केवल AURA Sports के आधिकारिक लिंक का उपयोग करें।')}</p><a className="text-link" href={localizePath('/', locale)}>{tr(locale, 'Return to homepage', 'होमपेज पर वापस जाएँ')} ↗</a></div></section>
  </main>;
}

export function AdditionalPage({ path, locale = 'en' }) {
  if (categoryPages[path]) return <EditorialCategoryPage path={path} locale={locale} />;
  if (path === '/about') return <AboutPage locale={locale} />;
  if (path === '/contact') return <ContactPage locale={locale} />;
  if (legalPages[path]) return <LegalPage path={path} locale={locale} />;
  if (path === '/download') return <DownloadPage locale={locale} />;
  return <main className="page-main"><section className="container article-missing"><span className="eyebrow">AURA Sports</span><h1>{tr(locale, 'Page not found', 'पेज नहीं मिला')}</h1><p>{tr(locale, "The page you're looking for isn't available.", 'आपका खोजा गया पेज उपलब्ध नहीं है।')}</p><a className="button button-gold" href={localizePath('/', locale)}>{tr(locale, 'Back to Home', 'होम पर वापस जाएँ')}</a></section></main>;
}

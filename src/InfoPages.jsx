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
    eyebrow: ['Using AURA', 'AURA का उपयोग'],
    description: ['The terms governing access to and use of the AURA website.', 'AURA वेबसाइट तक पहुँच और उसके उपयोग पर लागू होने वाली शर्तें।'],
    lastUpdated: ['Last Updated: 18 November 2026', 'अंतिम अपडेट: 18 नवंबर 2026'],
    intro: [
      ['Welcome to AURA. These Terms & Conditions (“Terms”) govern your access to and use of the AURA website.', 'AURA में आपका स्वागत है। ये नियम और शर्तें (“शर्तें”) AURA वेबसाइट तक आपकी पहुँच और उसके उपयोग को नियंत्रित करती हैं।'],
      ['By visiting or using this website, you acknowledge that you have read and understood these Terms. Your use of the website is subject to these Terms. If you do not agree with them, please discontinue using the website.', 'इस वेबसाइट पर आने या इसका उपयोग करने से, आप स्वीकार करते हैं कि आपने इन शर्तों को पढ़ और समझ लिया है। वेबसाइट का आपका उपयोग इन शर्तों के अधीन है। यदि आप इनसे सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग बंद कर दें।'],
      ['AURA is currently an independently operated brand managed by its founder and is not a separately incorporated company.', 'AURA वर्तमान में इसके संस्थापक द्वारा प्रबंधित एक स्वतंत्र रूप से संचालित ब्रांड है और यह कोई अलग से पंजीकृत कंपनी (Incorporated company) नहीं है।']
    ],
    sections: [
      { heading: ['1. Purpose of the Website', '1. वेबसाइट का उद्देश्य'], paragraphs: [
        ['The AURA website currently serves as an informational landing page.', 'AURA वेबसाइट वर्तमान में एक सूचनात्मक लैंडिंग पेज के रूप में कार्य करती है।'],
        ['It provides general information about the AURA brand, its identity and its digital offerings.', 'यह AURA ब्रांड, उसकी पहचान और उसकी डिजिटल पेशकशों के बारे में सामान्य जानकारी प्रदान करती है।'],
        ['The website does not currently provide:', 'वेबसाइट वर्तमान में निम्नलिखित प्रदान नहीं करती है:']
      ], bullets: {
        en: ['User registration or login accounts', 'Paid memberships or subscriptions', 'Online purchases or payment services', 'Betting, gambling or wagering services', 'News or article publishing services'],
        hi: ['यूजर रजिस्ट्रेशन या लॉगिन अकाउंट', 'सशुल्क सदस्यता या सब्सक्रिप्शन', 'ऑनलाइन खरीदारी या भुगतान सेवाएं', 'सट्टेबाजी, जुआ या दांव लगाने की सेवाएं', 'समाचार या लेख प्रकाशन सेवाएं']
      }, closing: ['Any future features or services introduced by AURA may be subject to additional terms or separate policies, where applicable.', 'AURA द्वारा शुरू की जाने वाली कोई भी भविष्य की विशेषताएं या सेवाएं, लागू होने पर, अतिरिक्त शर्तों या अलग नीतियों के अधीन हो सकती हैं।']},
      { heading: ['2. Permitted Use', '2. अनुमत उपयोग'], paragraphs: [
        ['You may access and use this website for lawful, personal and informational purposes.', 'आप वैध, व्यक्तिगत और सूचनात्मक उद्देश्यों के लिए इस वेबसाइट का उपयोग कर सकते हैं।'],
        ['You agree not to:', 'आप इसके लिए सहमत हैं कि आप ऐसा नहीं करेंगे:']
      ], bullets: {
        en: ['Use the website for any unlawful or fraudulent activity', 'Attempt to disrupt, damage or interfere with the website or its normal operation', 'Attempt unauthorized access to any part of the website or its supporting infrastructure', 'Copy, reproduce or misuse AURA’s branding or materials without permission', 'Use the website in any manner that could harm AURA, its operations or other visitors'],
        hi: ['किसी भी अवैध या धोखाधड़ी गतिविधि के लिए वेबसाइट का उपयोग करना', 'वेबसाइट या उसके सामान्य संचालन को बाधित करने, नुकसान पहुँचाने या उसमें हस्तक्षेप करने का प्रयास करना', 'वेबसाइट के किसी भी हिस्से या उसके बुनियादी ढांचे तक अनधिकृत पहुँच का प्रयास करना', 'बिना अनुमति के AURA की ब्रांडिंग या सामग्रियों की नकल करना, उन्हें पुनरुत्पादित करना या उनका दुरुपयोग करना', 'किसी भी ऐसे तरीके से वेबसाइट का उपयोग करना जिससे AURA, उसके संचालन या अन्य विजिटर्स को नुकसान पहुँच सके']
      }},
      { heading: ['3. Intellectual Property', '3. बौद्धिक संपदा (Intellectual Property)'], paragraphs: [
        ['Unless otherwise stated, the AURA name, logo, brand identity, design elements, original text, website content and other original materials displayed on this website are owned by the AURA brand’s founder or are used with appropriate permission.', 'जब तक अन्यथा न कहा जाए, AURA का नाम, लोगो, ब्रांड पहचान, डिज़ाइन तत्व, मूल पाठ (original text), वेबसाइट सामग्री और इस वेबसाइट पर प्रदर्शित अन्य मूल सामग्रियां AURA ब्रांड के संस्थापक के स्वामित्व में हैं या उचित अनुमति के साथ उपयोग की जाती हैं।'],
        ['These materials may not be reproduced, distributed, modified, commercially exploited or publicly used without prior written permission from the relevant rights holder, except where permitted by applicable law.', 'लागू कानून द्वारा अनुमति प्राप्त मामलों को छोड़कर, प्रासंगिक अधिकार धारक की पूर्व लिखित अनुमति के बिना इन सामग्रियों को पुनरुत्पादित, वितरित, संशोधित, व्यावसायिक रूप से शोषित या सार्वजनिक रूप से उपयोग नहीं किया जा सकता है।'],
        ['Third-party names, logos, trademarks and other materials remain the property of their respective owners. Their appearance on this website does not imply ownership by or affiliation with AURA.', 'तृतीय-पक्ष (Third-party) के नाम, लोगो, ट्रेडमार्क और अन्य सामग्रियां उनके संबंधित स्वामियों की संपत्ति बनी रहती हैं। इस वेबसाइट पर उनकी उपस्थिति का अर्थ AURA द्वारा स्वामित्व या उससे संबद्धता नहीं है।']
      ]},
      { heading: ['4. Information and Accuracy', '4. जानकारी और सटीकता'], paragraphs: [
        ['We aim to keep the information presented on the website clear and accurate.', 'हम वेबसाइट पर प्रस्तुत जानकारी को स्पष्ट और सटीक रखने का लक्ष्य रखते हैं।'],
        ['However, information may change, become outdated or contain unintentional errors. AURA does not guarantee that all website information will always be complete, current or error-free.', 'हालांकि, जानकारी बदल सकती है, पुरानी हो सकती है या उसमें अनजाने में त्रुटियां हो सकती हैं। AURA इस बात की गारंटी नहीं देता है कि वेबसाइट की सभी जानकारियां हमेशा पूर्ण, वर्तमान या त्रुटि-मुक्त होंगी।'],
        ['Any cricket-related information, analysis or predictions presented through AURA should be treated as informational only and must not be considered a guarantee of any particular result or outcome.', 'AURA के माध्यम से प्रस्तुत किसी भी क्रिकेट-संबंधी जानकारी, विश्लेषण या भविष्यवाणियों को केवल सूचनात्मक माना जाना चाहिए और इसे किसी विशेष परिणाम या नतीजे की गारंटी नहीं माना जाना चाहिए।']
      ]},
      { heading: ['5. No Betting or Gambling Services', '5. कोई सट्टेबाजी या जुआ सेवाएं नहीं'], paragraphs: [
        ['AURA is an informational cricket brand.', 'AURA एक सूचनात्मक क्रिकेट ब्रांड है।'],
        ['The website does not operate or provide betting, gambling, wagering or money-based gaming services.', 'वेबसाइट सट्टेबाजी, जुआ, दांव लगाने या पैसे से जुड़े गेमिंग की सेवाएं संचालित या प्रदान नहीं करती है।'],
        ['Nothing on this website should be interpreted as an invitation, recommendation or encouragement to participate in betting or gambling activities.', 'इस वेबसाइट की किसी भी बात को सट्टेबाजी या जुए की गतिविधियों में भाग लेने के लिए निमंत्रण, सिफारिश या प्रोत्साहन के रूप में नहीं समझा जाना चाहिए।']
      ]},
      { heading: ['6. Third-Party Links', '6. थर्ड-पार्टी लिंक'], paragraphs: [
        ['The website may contain links to third-party websites or services for convenience or additional information.', 'सुविधा या अतिरिक्त जानकारी के लिए वेबसाइट में तृतीय-पक्ष की वेबसाइटों या सेवाओं के लिंक हो सकते हैं।'],
        ['AURA does not own or control those external websites and is not responsible for their content, availability, policies, security or practices.', 'AURA उन बाहरी वेबसाइटों का मालिक नहीं है या उन्हें नियंत्रित नहीं करता है और उनकी सामग्री, उपलब्धता, नीतियों, सुरक्षा या प्रथाओं के लिए ज़िम्मेदार नहीं है।'],
        ['Accessing third-party websites or services is entirely at your own discretion and subject to their respective terms and policies.', 'तृतीय-पक्ष की वेबसाइटों या सेवाओं तक पहुँचना पूरी तरह से आपके अपने विवेक पर है और यह उनकी संबंधित शर्तों तथा नीतियों के अधीन है।']
      ]},
      { heading: ['7. Website Availability', '7. वेबसाइट की उपलब्धता'], paragraphs: [
        ['We aim to keep the website accessible, but uninterrupted or error-free availability cannot be guaranteed.', 'हम वेबसाइट को सुलभ बनाए रखने का लक्ष्य रखते हैं, लेकिन निर्बाध या त्रुटि-मुक्त उपलब्धता की गारंटी नहीं दी जा सकती है।'],
        ['We may update, modify, suspend or discontinue any part of the website when reasonably necessary, including for maintenance, security, technical or operational reasons.', 'हम रखरखाव, सुरक्षा, तकनीकी या परिचालन कारणों सहित जब उचित रूप से आवश्यक हो, वेबसाइट के किसी भी हिस्से को अपडेट, संशोधित, निलंबित या बंद कर सकते हैं।']
      ]},
      { heading: ['8. Limitation of Liability', '8. दायित्व की सीमा (Limitation of Liability)'], paragraphs: [
        ['To the extent permitted by applicable law, AURA will not be responsible for losses arising from temporary website unavailability, technical interruptions, third-party websites or reliance on information that may be incomplete, inaccurate or outdated.', 'लागू कानून द्वारा जितनी अनुमति है, AURA अस्थायी वेबसाइट अनुपलब्धता, तकनीकी रुकावटों, तृतीय-पक्ष वेबसाइटों या ऐसी जानकारी पर भरोसा करने से होने वाले नुकसान के लिए ज़िम्मेदार नहीं होगा जो अधूरी, अशुद्ध या पुरानी हो सकती है।'],
        ['Nothing in these Terms excludes or limits any liability, consumer rights or other legal protections that cannot legally be excluded or limited under applicable law.', 'इन शर्तों की कोई भी बात ऐसे किसी दायित्व, उपभोक्ता अधिकार या अन्य कानूनी संरक्षण को समाप्त या सीमित नहीं करती, जिसे लागू कानून के तहत कानूनी रूप से समाप्त या सीमित नहीं किया जा सकता।']
      ]},
      { heading: ['9. Changes to These Terms', '9. इन शर्तों में परिवर्तन'], paragraphs: [
        ['AURA may update these Terms when the website, its features, services or applicable legal requirements change.', 'जब वेबसाइट, उसकी विशेषताएं, सेवाएं या लागू कानूनी आवश्यकताएं बदलती हैं, तो AURA इन शर्तों को अपडेट कर सकता है।'],
        ['Any updated version will be published on this page with a revised “Last Updated” date.', 'संशोधित “अंतिम अपडेट” (Last Updated) तिथि के साथ कोई भी अपडेट किया गया संस्करण इस पृष्ठ पर प्रकाशित किया जाएगा।'],
        ['Visitors are encouraged to review these Terms periodically. Continued use of the website after updated Terms are published will be subject to the revised Terms, to the extent permitted by applicable law.', 'विजिटर्स से अनुरोध है कि वे समय-समय पर इन शर्तों की समीक्षा करें। अपडेट की गई शर्तें प्रकाशित होने के बाद वेबसाइट का निरंतर उपयोग लागू कानून द्वारा अनुमति की सीमा तक संशोधित शर्तों के अधीन होगा।']
      ]},
      { heading: ['10. Governing Law', '10. लागू कानून (Governing Law)'], paragraphs: [
        ['These Terms shall be governed by and interpreted in accordance with the laws of India.', 'ये शर्तें भारत के कानूनों के अनुसार शासित और व्याख्यायित की जाएंगी।'],
        ['Any disputes arising in connection with these Terms or the use of this website shall be subject to the jurisdiction of competent courts in India, subject to applicable law.', 'इन शर्तों या इस वेबसाइट के उपयोग के संबंध में उत्पन्न होने वाले किसी भी विवाद को लागू कानून के अधीन, भारत में सक्षम न्यायालयों के अधिकार क्षेत्र के अधीन रखा जाएगा।']
      ]},
      { heading: ['11. Contact Us', '11. हमसे संपर्क करें'], paragraphs: [
        ['For questions or concerns regarding these Terms, please contact:', 'इन शर्तों के संबंध में प्रश्नों या चिंताओं के लिए, कृपया संपर्क करें:'],
        ['Email: customercare.aurasports@gmail.com', 'ईमेल: customercare.aurasports@gmail.com']
      ], closing: ['These Terms apply to the AURA website in its current form and may be revised if new features, services or functionalities are introduced.', 'ये शर्तें अपने वर्तमान स्वरूप में AURA वेबसाइट पर लागू होती हैं और यदि नई विशेषताएं, सेवाएं या कार्यक्षमताएं शुरू की जाती हैं तो इन्हें संशोधित किया जा सकता है।']}
    ]
  },
  '/disclaimer': {
    title: ['Disclaimer', 'अस्वीकरण (Disclaimer)'],
    eyebrow: ['Important information', 'महत्वपूर्ण जानकारी'],
    description: ['Important information about the AURA website and its content.', 'AURA वेबसाइट और उसकी सामग्री के बारे में महत्वपूर्ण जानकारी।'],
    lastUpdated: ['Last Updated: 18 November 2026', 'अंतिम अपडेट: 18 नवंबर 2026'],
    intro: [
      ['Welcome to AURA.', 'AURA में आपका स्वागत है।'],
      ['This Disclaimer applies to your access to and use of the AURA website. By visiting or using this website, you acknowledge that you have read and understood this Disclaimer.', 'यह अस्वीकरण (Disclaimer) AURA वेबसाइट तक आपकी पहुँच और उसके उपयोग पर लागू होता है। इस वेबसाइट पर आने या इसका उपयोग करने से, आप स्वीकार करते हैं कि आपने इस अस्वीकरण को पढ़ और समझ लिया है।'],
      ['AURA is currently an independently operated brand managed by its founder and is not a separately incorporated company.', 'AURA वर्तमान में इसके संस्थापक द्वारा प्रबंधित एक स्वतंत्र रूप से संचालित ब्रांड है और यह कोई अलग से पंजीकृत कंपनी नहीं है।']
    ],
    sections: [
      { heading: ['1. General Information', '1. सामान्य जानकारी'], paragraphs: [
        ['The AURA website currently serves as an informational landing page. It provides general information about the AURA brand, its identity and its digital offerings.', 'AURA वेबसाइट वर्तमान में एक सूचनात्मक लैंडिंग पेज के रूप में कार्य करती है। यह AURA ब्रांड, उसकी पहचान और उसकी डिजिटल पेशकशों के बारे में सामान्य जानकारी प्रदान करती है।'],
        ['The information presented on this website is provided for general informational purposes only.', 'इस वेबसाइट पर प्रस्तुत जानकारी केवल सामान्य सूचनात्मक उद्देश्यों के लिए प्रदान की गई है।'],
        ['Although we aim to keep the information clear and accurate, AURA does not guarantee that all content will always be complete, current, accurate or free from errors.', 'यद्यपि हमारा लक्ष्य जानकारी को स्पष्ट और सटीक रखना है, AURA इस बात की गारंटी नहीं देता है कि सारी सामग्री हमेशा पूर्ण, वर्तमान, सटीक या त्रुटि-मुक्त होगी।']
      ]},
      { heading: ['2. Cricket Information and Predictions', '2. क्रिकेट की जानकारी और भविष्यवाणियां'], paragraphs: [
        ['Where AURA provides cricket-related information, analysis, insights or predictions through its offerings, such content is intended for informational and entertainment purposes only.', 'जहाँ AURA अपनी पेशकशों के माध्यम से क्रिकेट से जुड़ी जानकारी, विश्लेषण, अंतर्दृष्टि या भविष्यवाणियां प्रदान करता है, ऐसी सामग्री केवल सूचनात्मक और मनोरंजन के उद्देश्यों के लिए होती है।'],
        ['Cricket is an unpredictable sport, and match outcomes may depend on various factors. Any analysis, insights or predictions should not be treated as guaranteed results, professional advice or assurances of success.', 'क्रिकेट एक अनिश्चित खेल है, और मैच के परिणाम विभिन्न कारकों पर निर्भर हो सकते हैं। किसी भी विश्लेषण, अंतर्दृष्टि या भविष्यवाणी को गारंटीकृत परिणाम, पेशेवर सलाह या सफलता का आश्वासन नहीं माना जाना चाहिए।'],
        ['AURA makes no guarantee regarding the accuracy of any prediction or the outcome of any match.', 'AURA किसी भी भविष्यवाणी की सटीकता या किसी भी मैच के परिणाम के संबंध में कोई गारंटी नहीं देता है।'],
        ['Visitors should use their own judgement when interpreting or relying on cricket-related information.', 'विजिटर्स को क्रिकेट से जुड़ी जानकारी की व्याख्या करते समय या उस पर भरोसा करते समय अपने स्वयं के विवेक का उपयोग करना चाहिए।']
      ]},
      { heading: ['3. No Betting or Gambling Services', '3. कोई सट्टेबाजी या जुआ सेवाएं नहीं'], paragraphs: [
        ['AURA does not operate or provide betting, gambling, wagering or money-based gaming services.', 'AURA सट्टेबाजी, जुआ, दांव लगाने या पैसे आधारित गेमिंग सेवाएं संचालित या प्रदान नहीं करता है।'],
        ['Nothing on this website or in any AURA content should be interpreted as an invitation, recommendation or encouragement to participate in betting, gambling or wagering activities.', 'इस वेबसाइट या किसी भी AURA सामग्री में मौजूद किसी भी बात को सट्टेबाजी, जुए या दांव लगाने की गतिविधियों में भाग लेने के लिए निमंत्रण, सिफारिश या प्रोत्साहन के रूप में नहीं समझा जाना चाहिए।'],
        ['AURA does not guarantee or promote financial gains or winnings through any cricket-related information, analysis or predictions.', 'AURA क्रिकेट से जुड़ी किसी भी जानकारी, विश्लेषण या भविष्यवाणी के माध्यम से वित्तीय लाभ या जीत का वादा या प्रचार नहीं करता है।']
      ]},
      { heading: ['4. Personal Responsibility', '4. व्यक्तिगत ज़िम्मेदारी'], paragraphs: [
        ['Visitors are responsible for how they use and interpret the information available on this website.', 'विजिटर्स इस बात के लिए ज़िम्मेदार हैं कि वे इस वेबसाइट पर उपलब्ध जानकारी का उपयोग और व्याख्या कैसे करते हैं।'],
        ['Any decisions made based on information presented by AURA are taken at the visitor’s own discretion and responsibility.', 'AURA द्वारा प्रस्तुत जानकारी के आधार पर लिए गए कोई भी निर्णय विजिटर के अपने विवेक और ज़िम्मेदारी पर लिए जाते हैं।'],
        ['AURA shall not be responsible for decisions made solely on the basis of general information, analysis or predictions provided through its website, to the extent permitted by applicable law.', 'लागू कानून द्वारा जितनी अनुमति है, AURA अपनी वेबसाइट के माध्यम से प्रदान की गई सामान्य जानकारी, विश्लेषण या भविष्यवाणियों के आधार पर अकेले लिए गए निर्णयों के लिए ज़िम्मेदार नहीं होगा।']
      ]},
      { heading: ['5. Third-Party Websites and Links', '5. थर्ड-पार्टी वेबसाइट्स और लिंक'], paragraphs: [
        ['The AURA website may contain links to third-party websites or services for convenience or additional information.', 'सुविधा या अतिरिक्त जानकारी के लिए AURA वेबसाइट में तृतीय-पक्ष (third-party) वेबसाइटों या सेवाओं के लिंक हो सकते हैं।'],
        ['AURA does not own or control these external websites and does not guarantee the accuracy, availability, security or reliability of their content or services.', 'AURA इन बाहरी वेबसाइटों का मालिक नहीं है या उन्हें नियंत्रित नहीं करता है और उनकी सामग्री, उपलब्धता, सुरक्षा या विश्वसनीयता की गारंटी नहीं देता है।'],
        ['Visitors access third-party websites at their own discretion and should review the applicable terms and privacy policies of those websites.', 'विजिटर्स अपने विवेक से तृतीय-पक्ष की वेबसाइटों तक पहुँचते हैं और उन्हें उन वेबसाइटों की लागू शर्तों तथा गोपनीयता नीतियों की समीक्षा करनी चाहिए।']
      ]},
      { heading: ['6. Website Availability and Technical Issues', '6. वेबसाइट की उपलब्धता और तकनीकी समस्याएं'], paragraphs: [
        ['AURA aims to keep its website accessible and functional. However, uninterrupted, secure or error-free availability cannot be guaranteed.', 'AURA अपनी वेबसाइट को सुलभ और कार्यात्मक बनाए रखने का लक्ष्य रखता है। हालांकि, निर्बाध, सुरक्षित या त्रुटि-मुक्त उपलब्धता की गारंटी नहीं दी जा सकती है।'],
        ['Temporary interruptions, technical issues, maintenance or other operational circumstances may affect website access or functionality.', 'अस्थायी रुकावटें, तकनीकी समस्याएं, रखरखाव या अन्य परिचालन परिस्थितियां वेबसाइट की पहुँच या कार्यक्षमता को प्रभावित कर सकती हैं।'],
        ['AURA shall not be responsible for losses arising from such interruptions or technical issues, to the extent permitted by applicable law.', 'लागू कानून द्वारा जितनी अनुमति है, AURA ऐसी रुकावटों या तकनीकी समस्याओं से होने वाले नुकसान के लिए ज़िम्मेदार नहीं होगा।']
      ]},
      { heading: ['7. Limitation of Liability', '7. दायित्व की सीमा (Limitation of Liability)'], paragraphs: [
        ['To the extent permitted by applicable law, AURA shall not be responsible for any loss or damage arising from reliance on information presented on the website, the use or inability to use the website, technical interruptions or third-party websites and services.', 'लागू कानून द्वारा जितनी अनुमति है, AURA वेबसाइट पर प्रस्तुत जानकारी पर भरोसा करने, वेबसाइट का उपयोग करने या उपयोग करने में असमर्थता, तकनीकी रुकावटों या तृतीय-पक्ष वेबसाइटों और सेवाओं से उत्पन्न होने वाले किसी भी नुकसान या क्षति के लिए ज़िम्मेदार नहीं होगा।'],
        ['Nothing in this Disclaimer excludes or limits any liability, consumer rights or other legal protections that cannot legally be excluded or limited under applicable law.', 'इस अस्वीकरण की कोई भी बात ऐसे किसी दायित्व, उपभोक्ता अधिकार या अन्य कानूनी संरक्षण को समाप्त या सीमित नहीं करती, जिसे लागू कानून के तहत कानूनी रूप से समाप्त या सीमित नहीं किया जा सकता।']
      ]},
      { heading: ['8. Changes to This Disclaimer', '8. इस अस्वीकरण में परिवर्तन'], paragraphs: [
        ['AURA may update this Disclaimer when the website, its features, services or applicable legal requirements change.', 'जब वेबसाइट, उसकी विशेषताएं, सेवाएं या लागू कानूनी आवश्यकताएं बदलती हैं, तो AURA इस अस्वीकरण को अपडेट कर सकता है।'],
        ['Any revised version will be published on this page with an updated “Last Updated” date.', 'संशोधित “अंतिम अपडेट” (Last Updated) तिथि के साथ कोई भी संशोधित संस्करण इस पृष्ठ पर प्रकाशित किया जाएगा।'],
        ['Visitors are encouraged to review this page periodically.', 'विजिटर्स से अनुरोध है कि वे समय-समय पर इस पृष्ठ की समीक्षा करें।']
      ]},
      { heading: ['9. Contact Us', '9. हमसे संपर्क करें'], paragraphs: [
        ['For questions or concerns regarding this Disclaimer, please contact:', 'इस अस्वीकरण के संबंध में प्रश्नों या चिंताओं के लिए, कृपया संपर्क करें:'],
        ['Email: customercare.aurasports@gmail.com', 'ईमेल: customercare.aurasports@gmail.com']
      ], closing: ['This Disclaimer applies to the AURA website in its current form and may be revised if new features, services or functionalities are introduced.', 'यह अस्वीकरण अपने वर्तमान स्वरूप में AURA वेबसाइट पर लागू होता है और यदि नई विशेषताएं, सेवाएं या कार्यक्षमताएं शुरू की जाती हैं तो इसे संशोधित किया जा सकता है।']}
    ]
  }
};

function LegalPage({ path, locale }) {
  const page = legalPages[path];
  const index = locale === 'hi' ? 1 : 0;
  return <main className="page-main"><PageHero eyebrow={page.eyebrow[index]} title={page.title[index]} description={page.description[index]} /><section className="container legal-content">{page.lastUpdated && <p className="legal-updated">{page.lastUpdated[index]}</p>}{page.intro && page.intro.map((paragraph, i) => <p key={i}>{paragraph[index]}</p>)}{page.notice && <div className="draft-notice">{page.notice[index]}</div>}{page.sections.map((section) => {
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

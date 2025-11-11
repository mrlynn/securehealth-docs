import React from 'react';
import Layout from '@theme/Layout';
import FAQAccordion from '@site/src/components/FAQAccordion';
import { faqData } from '@site/src/components/FAQAccordion/faqData';

export default function FAQDemo() {
  return (
    <Layout
      title="FAQ Demo"
      description="Interactive FAQ component demonstration for SecureHealth documentation"
    >
      <div style={{ padding: '2rem 0' }}>
        <FAQAccordion faqData={faqData} />
      </div>
    </Layout>
  );
}

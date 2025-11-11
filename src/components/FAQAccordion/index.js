import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

function FAQItem({ question, answer, isOpen, onToggle, index }) {
  return (
    <div className={clsx(styles.faqItem, isOpen && styles.faqItemOpen)}>
      <button
        className={styles.faqQuestion}
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={clsx(styles.chevron, isOpen && styles.chevronOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      <div
        id={`faq-answer-${index}`}
        className={clsx(styles.faqAnswer, isOpen && styles.faqAnswerOpen)}
        aria-hidden={!isOpen}
      >
        <div className={styles.answerContent} dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
}

function RoleTab({ role, isActive, onClick, count }) {
  return (
    <button
      className={clsx(styles.roleTab, isActive && styles.roleTabActive)}
      onClick={() => onClick(role.key)}
    >
      <span className={styles.roleName}>{role.name}</span>
      <span className={styles.roleCount}>({count})</span>
    </button>
  );
}

function SearchBar({ searchTerm, onSearchChange, placeholder }) {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function FAQAccordion({ faqData }) {
  const [activeRole, setActiveRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  // Extract roles from FAQ data
  const roles = useMemo(() => {
    const roleMap = new Map();
    roleMap.set('all', { name: 'All Questions', key: 'all' });
    
    faqData.forEach(section => {
      if (section.role) {
        roleMap.set(section.role, { name: section.role, key: section.role });
      }
    });
    
    return Array.from(roleMap.values());
  }, [faqData]);

  // Filter and search FAQ items
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by role
    if (activeRole !== 'all') {
      filtered = filtered.filter(section => section.role === activeRole);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.map(section => ({
        ...section,
        categories: section.categories.map(category => ({
          ...category,
          questions: category.questions.filter(qa => 
            qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })).filter(category => category.questions.length > 0)
      })).filter(section => section.categories.length > 0);
    }

    return filtered;
  }, [faqData, activeRole, searchTerm]);

  // Count questions per role
  const roleCounts = useMemo(() => {
    const counts = {};
    roles.forEach(role => {
      if (role.key === 'all') {
        counts[role.key] = faqData.reduce((total, section) => 
          total + section.categories.reduce((catTotal, cat) => catTotal + cat.questions.length, 0), 0
        );
      } else {
        const roleData = faqData.filter(section => section.role === role.key);
        counts[role.key] = roleData.reduce((total, section) => 
          total + section.categories.reduce((catTotal, cat) => catTotal + cat.questions.length, 0), 0
        );
      }
    });
    return counts;
  }, [faqData, roles]);

  const toggleItem = (sectionIndex, categoryIndex, questionIndex) => {
    const key = `${sectionIndex}-${categoryIndex}-${questionIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  const isItemOpen = (sectionIndex, categoryIndex, questionIndex) => {
    const key = `${sectionIndex}-${categoryIndex}-${questionIndex}`;
    return openItems.has(key);
  };

  return (
    <div className={styles.faqContainer}>
      {/* Header */}
      <div className={styles.faqHeader}>
        <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        <p className={styles.faqSubtitle}>
          Find answers to common questions about SecureHealth, organized by your role and interests.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search questions and answers..."
      />

      {/* Role Tabs */}
      <div className={styles.roleTabs}>
        {roles.map(role => (
          <RoleTab
            key={role.key}
            role={role}
            isActive={activeRole === role.key}
            onClick={setActiveRole}
            count={roleCounts[role.key] || 0}
          />
        ))}
      </div>

      {/* FAQ Content */}
      <div className={styles.faqContent}>
        {filteredFAQs.length === 0 ? (
          <div className={styles.noResults}>
            <svg className={styles.noResultsIcon} width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h3>No questions found</h3>
            <p>Try adjusting your search terms or selecting a different role.</p>
          </div>
        ) : (
          filteredFAQs.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.section}>
              {section.title && (
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              )}
              {section.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className={styles.category}>
                  {category.title && (
                    <h4 className={styles.categoryTitle}>{category.title}</h4>
                  )}
                  <div className={styles.questionsList}>
                    {category.questions.map((qa, questionIndex) => (
                      <FAQItem
                        key={questionIndex}
                        question={qa.question}
                        answer={qa.answer}
                        isOpen={isItemOpen(sectionIndex, categoryIndex, questionIndex)}
                        onToggle={() => toggleItem(sectionIndex, categoryIndex, questionIndex)}
                        index={`${sectionIndex}-${categoryIndex}-${questionIndex}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.faqFooter}>
        <p>
          <strong>Still have questions?</strong> Check out our{' '}
          <a href="/docs/community/support" className={styles.footerLink}>
            Support
          </a>{' '}
          section or{' '}
          <a href="https://securehealth.dev" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
            try the live demo
          </a>{' '}
          to see SecureHealth in action.
        </p>
      </div>
    </div>
  );
}

import { render, screen } from '@mobile/test-utils';
import { Body, Display, SectionTitleText, Title, Meta } from '../typography';

describe('Typography', () => {
  describe('Body', () => {
    it('renders children correctly', () => {
      render(<Body>Test text</Body>);
      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('applies default variant "body"', () => {
      const { getByText } = render(<Body>Default body</Body>);
      expect(getByText('Default body')).toBeTruthy();
    });

    it('applies tone prop', () => {
      const { getByText } = render(<Body tone="secondary">Secondary text</Body>);
      expect(getByText('Secondary text')).toBeTruthy();
    });

    it('applies weight prop', () => {
      const { getByText } = render(<Body weight="bold">Bold text</Body>);
      expect(getByText('Bold text')).toBeTruthy();
    });

    it('applies custom style', () => {
      const { getByText } = render(<Body style={{ opacity: 0.5 }}>Custom style</Body>);
      expect(getByText('Custom style')).toBeTruthy();
    });
  });

  describe('Display', () => {
    it('renders display text', () => {
      render(<Display>Display heading</Display>);
      expect(screen.getByText('Display heading')).toBeTruthy();
    });

    it('uses display font family', () => {
      const { getByText } = render(<Display>Display</Display>);
      expect(getByText('Display')).toBeTruthy();
    });
  });

  describe('SectionTitleText', () => {
    it('renders section title', () => {
      render(<SectionTitleText>Section Title</SectionTitleText>);
      expect(screen.getByText('Section Title')).toBeTruthy();
    });
  });

  describe('Title', () => {
    it('renders title text', () => {
      render(<Title>Title Text</Title>);
      expect(screen.getByText('Title Text')).toBeTruthy();
    });
  });

  describe('Meta', () => {
    it('renders meta text', () => {
      render(<Meta>Meta information</Meta>);
      expect(screen.getByText('Meta information')).toBeTruthy();
    });

    it('uses meta font family (Space Mono)', () => {
      const { getByText } = render(<Meta>Meta</Meta>);
      expect(getByText('Meta')).toBeTruthy();
    });
  });
});

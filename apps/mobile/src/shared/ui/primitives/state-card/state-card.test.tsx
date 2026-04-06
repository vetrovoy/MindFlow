import { render, screen } from '@mobile/test-utils';
import { StateCard } from './index';

describe('StateCard', () => {
  it('renders empty state content', () => {
    render(
      <StateCard
        variant="empty"
        title="Пусто"
        description="Добавьте первую задачу."
      />,
    );

    expect(screen.getByText('Пусто')).toBeTruthy();
    expect(screen.getByText('Добавьте первую задачу.')).toBeTruthy();
  });

  it('renders loading state content', () => {
    render(<StateCard variant="loading" title="Загрузка" />);
    expect(screen.getByText('Загрузка')).toBeTruthy();
  });

  it('renders error state content', () => {
    render(
      <StateCard
        variant="error"
        title="Ошибка"
        description="Что-то пошло не так."
      />,
    );
    expect(screen.getByText('Ошибка')).toBeTruthy();
    expect(screen.getByText('Что-то пошло не так.')).toBeTruthy();
  });
});

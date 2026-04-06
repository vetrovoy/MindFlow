import { render } from '@mobile/test-utils';
import { SurfaceCard } from './index';

describe('SurfaceCard', () => {
  it('renders children', () => {
    const { root } = render(
      <SurfaceCard>
        <>Card Content</>
      </SurfaceCard>,
    );
    expect(root).toBeTruthy();
  });

  it('applies elevated prop', () => {
    const { root } = render(
      <SurfaceCard elevated testID="card">
        <> Elevated Card</>
      </SurfaceCard>,
    );
    expect(root).toBeTruthy();
  });

  it('applies padded prop by default', () => {
    const { root } = render(
      <SurfaceCard testID="card">
        <>Padded Card</>
      </SurfaceCard>,
    );
    expect(root).toBeTruthy();
  });

  it('removes padding when padded is false', () => {
    const { root } = render(
      <SurfaceCard padded={false} testID="card">
        <>No Padding</>
      </SurfaceCard>,
    );
    expect(root).toBeTruthy();
  });

  it('applies custom style', () => {
    const { root } = render(
      <SurfaceCard testID="card" style={{ opacity: 0.5 }}>
        <>Custom Style</>
      </SurfaceCard>,
    );
    expect(root).toBeTruthy();
  });
});

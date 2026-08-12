import type { Producer } from '../../domain/entities/producer';
import { producersActions, producersReducer } from './producers.slice';

const seed: Producer[] = [
  { id: 'p-1', document: '39053344705', name: 'João' },
  { id: 'p-2', document: '11222333000181', name: 'Maria' },
];

describe('producers slice', () => {
  it('inicia vazio e idle', () => {
    const state = producersReducer(undefined, { type: 'init' });
    expect(state.ids).toEqual([]);
    expect(state.status).toBe('idle');
  });

  it('marca loading e limpa erro em loadStarted', () => {
    const state = producersReducer(undefined, producersActions.loadStarted());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('preenche byId + ids em loadSucceeded', () => {
    const state = producersReducer(
      undefined,
      producersActions.loadSucceeded(seed),
    );
    expect(state.ids).toEqual(['p-1', 'p-2']);
    expect(state.byId['p-1'].name).toBe('João');
    expect(state.status).toBe('succeeded');
  });

  it('grava erro em loadFailed', () => {
    const state = producersReducer(
      undefined,
      producersActions.loadFailed('boom'),
    );
    expect(state.error).toBe('boom');
    expect(state.status).toBe('failed');
  });

  it('faz upsert (adiciona quando não existe)', () => {
    let state = producersReducer(
      undefined,
      producersActions.loadSucceeded(seed),
    );
    state = producersReducer(
      state,
      producersActions.upserted({
        id: 'p-3',
        document: '52998224725',
        name: 'Carla',
      }),
    );
    expect(state.ids).toContain('p-3');
    expect(state.byId['p-3'].name).toBe('Carla');
  });

  it('faz upsert (atualiza quando existe)', () => {
    let state = producersReducer(
      undefined,
      producersActions.loadSucceeded(seed),
    );
    state = producersReducer(
      state,
      producersActions.upserted({ ...seed[0], name: 'João Silva' }),
    );
    expect(state.ids).toEqual(['p-1', 'p-2']);
    expect(state.byId['p-1'].name).toBe('João Silva');
  });

  it('remove item existente', () => {
    let state = producersReducer(
      undefined,
      producersActions.loadSucceeded(seed),
    );
    state = producersReducer(state, producersActions.removed('p-1'));
    expect(state.ids).toEqual(['p-2']);
    expect(state.byId['p-1']).toBeUndefined();
  });
});

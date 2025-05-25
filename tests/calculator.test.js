const { calculateAge, calculateRER, calculateMER } = require('../calculator');

describe('calculateAge', () => {
    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-15'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test('returns zero when birthday is today', () => {
        expect(calculateAge('2024-01-15')).toBeCloseTo(0);
    });

    test('handles birthday later in the same month', () => {
        expect(calculateAge('2023-01-31')).toBeCloseTo(11 / 12);
    });

    test('calculates years and months correctly', () => {
        expect(calculateAge('2022-06-15')).toBeCloseTo(1 + 7 / 12);
    });
});

describe('calculateRER', () => {
  test('calculates RER for 5kg', () => {
    expect(calculateRER(5)).toBeCloseTo(70 * Math.pow(5, 0.75));
  });
});

describe('calculateMER', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  test('under 4 months uses 2.5x RER', () => {
    const weight = 5;
    const birthDate = '2023-11-01';
    const neutered = 'yes';
    expect(calculateMER(weight, birthDate, neutered)).toBe(585);
  });

  test('4-12 months uses 2.0x RER', () => {
    expect(calculateMER(5, '2023-07-01', 'no')).toBe(468);
  });

  test('adult neutered uses 1.2x RER', () => {
    expect(calculateMER(5, '2023-01-01', 'yes')).toBe(281);
  });

  test('adult intact uses 1.4x RER', () => {
    expect(calculateMER(5, '2023-01-01', 'no')).toBe(328);
  });
});

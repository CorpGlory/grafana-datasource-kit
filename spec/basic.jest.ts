import { hiThere } from '../testfile'

describe('Basic test', function() {
  let text = 'I am a basic test';

  it("should work", function() {
    expect(text).toBe('I am a basic test');
  })
})

describe('TS parse test', function() {
  it('Should import from TS files', function() {
    expect(hiThere).toBe(1);
  })
})

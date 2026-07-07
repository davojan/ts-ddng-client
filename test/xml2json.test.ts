import { xml2json } from '../src/xml2json'

test('xml2json preserves primitive values', () => {
  expect(xml2json('value')).toBe('value')
})

test('xml2json resolves nested map values recursively', () => {
  expect(
    xml2json({
      $attributes: { $xsiType: { type: 'Map' } },
      item: [
        {
          key: { $value: 'enabled' },
          value: {
            $attributes: { $xsiType: { type: 'boolean' } },
            $value: true,
          },
        },
      ],
    }),
  ).toEqual({ enabled: true })
})

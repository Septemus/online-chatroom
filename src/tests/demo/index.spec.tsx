import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import Counter from './count';
describe("demo", () => {
  render(<Counter/>)
  test('counter will plus one when clicking add', async () => {
    const numberEl=screen.queryByTestId(
      'count-number',
    )
    expect(numberEl?.textContent).toBe('0')
    const bt = screen.getByText('++count')
    await userEvent.click(bt)
    expect(numberEl?.textContent).toBe('1')
  });

})
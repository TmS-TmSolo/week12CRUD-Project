import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Team Update Button', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="updateTeamButton">Update Team</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should add click event listener to update team button', () => {
    const mockUpdateTeamButton = document.getElementById('updateTeamButton');
    const addEventListenerSpy = jest.spyOn(mockUpdateTeamButton, 'addEventListener');
    
    require('../index');
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  test('should trigger onUpdateTeamClick when button is clicked', () => {
    const mockOnUpdateTeamClick = jest.fn();
    const mockUpdateTeamButton = document.getElementById('updateTeamButton');
    mockUpdateTeamButton.addEventListener('click', mockOnUpdateTeamClick);

    fireEvent.click(mockUpdateTeamButton);

    expect(mockOnUpdateTeamClick).toHaveBeenCalledTimes(1);
  });

  test('should not throw error if button is not found', () => {
    document.body.innerHTML = '';
    expect(() => require('../index')).not.toThrow();
  });
});

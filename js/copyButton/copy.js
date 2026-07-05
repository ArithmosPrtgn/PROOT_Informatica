const copyButtons = document.querySelectorAll('.cBButton');

copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        
        const wrapper = button.closest('.codeBlock');
        const codeElement = wrapper.querySelector('code');
        
        const textToCopy = codeElement.textContent;

        try {
            await navigator.clipboard.writeText(textToCopy);

            const icon = button.querySelector('.material-symbols-rounded');
            const originalIcon = icon.textContent;
            
            icon.textContent = 'check';
            icon.style.color = 'var(--altYesColor)'
            button.style.color = 'var(--altYesColor)';

            setTimeout(() => {
                icon.textContent = originalIcon;
                button.style.color = 'var(--invertedNonAccentColor)';
                icon.style.color = 'var(--invertedNonAccentColor)';
            }, 2000);

        } catch (err) {
            console.error('Falha ao copiar o texto: ', err);
        }
    });
});
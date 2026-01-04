import { registerPlugin } from '@capacitor/core';

export interface SharedPdfPlugin {
    getSharedPdf(): Promise<{ data: string; name: string; timestamp: number } | null>;
    clearSharedPdf(): Promise<void>;
}

const SharedPdf = registerPlugin<SharedPdfPlugin>('SharedPdf', {
    web: () => {
        return {
            async getSharedPdf() {
                return null;
            },
            async clearSharedPdf() { },
        };
    },
});

export default SharedPdf;

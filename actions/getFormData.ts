"use server";

export async function getFormData(formData: FormData) {
const variation = formData.get('variation') || '70';
const tone = formData.get('tone') || 'professional';
const audience = formData.get('audience') || 'general';
}

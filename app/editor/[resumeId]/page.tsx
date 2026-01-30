import EditorLayout from "@/components/features/editor/EditorLayout";

export default async function EditorPage({ params }: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = await params;
    return <EditorLayout resumeId={resumeId} />;
}

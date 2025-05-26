import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, collection, where, query, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
    item: {
        id: string;
        task: string;
        created: string;
        user: string;
        public: boolean;
    }
    allComments: CommentsProps[]
}

interface CommentsProps {
    comment: string;
    name: string;
    taskId: string;
    user: string;
    id: string;
}

export default function Task({ item, allComments }: TaskProps) {
    const { data: session } = useSession();
    const [input, setInput] = useState<string>('');
    const [comment, setComment] = useState<CommentsProps[]>(allComments || [])

    const handleRegisterComment = async (event: FormEvent) => {
        event.preventDefault();

        if (input === '') return;
        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                taskId: item?.id,
                user: session?.user?.email,
                name: session?.user?.name
            })

            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.id,
            }

            setComment((oldItems) => [...oldItems, data])
            setInput('');

        } catch (err) {
            console.log(`Erro ao cadastrar no banco de dados ${err}`);
        }
    }

    const handleDeleteComment = async (id: string) => {
        try {
            const docRef = doc(db, "comments", id);
            await deleteDoc(docRef);

            const deletComment = comment.filter((item) => item.id !== id)
            setComment(deletComment)

        } catch (err) {
            console.log(`Erro ${err}`)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>
            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{item?.task}</p>
                </article>
            </main>
            <section className={styles.commentsContainer}>
                <h2>Comentários</h2>
                <form onSubmit={handleRegisterComment}>
                    <TextArea placeholder="Deixe seu comentário" onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} value={input} />
                    <button className={styles.button} disabled={!session?.user?.email}>Enviar comentário</button>
                </form>
            </section>
            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {comment.length === 0 && (
                    <span>Nenhum comentário foi encontrado...</span>
                )}
                {comment.map((item) => (
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button onClick={() => handleDeleteComment(item.id)} className={styles.buttonTrash}>
                                    <FaTrash size={18} color="#EA3140" />
                                </button>
                            )}
                        </div>
                        <p>{item.comment}</p>
                    </article>

                ))}
            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const docRef = doc(db, "tasks", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const milliseconds = snapshot.data()?.created?.seconds * 1000;
    const taskTarefas = {
        id: snapshot.id,
        task: snapshot.data()?.task,
        created: new Date(milliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        public: snapshot.data()?.public
    }

    const q = query(collection(db, "comments"), where("taskId", "==", id));
    const snapshotComments = await getDocs(q);

    let allComments: CommentsProps[] = [];

    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            taskId: doc.data().taskId,
            user: doc.data().user,
            name: doc.data().name
        })
    })

    return {
        props: {
            item: taskTarefas,
            allComments: allComments
        }
    }
}

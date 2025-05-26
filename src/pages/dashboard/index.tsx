import styles from "./styles.module.css"
import Head from "next/head"
import { getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { TextArea } from "@/components/textarea"
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { db } from "@/services/firebaseConnection"
import { addDoc, collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from "firebase/firestore"
import Link from "next/link"


interface UserProps {
    user: {
        email: string
    }
}

interface TasksProps {
    id: string;
    created: Date;
    task: string;
    public: boolean;
    user: string
}

export default function Dashboard({ user }: UserProps) {
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<TasksProps[]>([])

    useEffect(() => {
        async function loadTasks() {
            const reference = collection(db, "tasks")
            const queryRef = query(reference, orderBy("created", "desc"), where("user", "==", user?.email))

            const unsub = onSnapshot(queryRef, (snapshot) => {
                let list: TasksProps[] = []

                snapshot.forEach((doc) => {
                    list.push(
                        {
                            id: doc.id,
                            task: doc.data().task,
                            created: doc.data().created,
                            public: doc.data().public,
                            user: doc.data().user
                        }
                    )
                })

                setTasks(list)

            })

            return () => {
                if (unsub) unsub();
            }
        }
        loadTasks()
    }, [user?.email])


    const handleChangePublic = (event: ChangeEvent<HTMLInputElement>) => {
        setPublicTask(event.target.checked)
    }

    const handleRegisterTask = async (e: FormEvent) => {
        e.preventDefault()

        if (!input) return;

        try {
            await addDoc(collection(db, "tasks"), {
                task: input,
                public: publicTask,
                created: new Date(),
                user: user?.email
            })

            setInput("")
            setPublicTask(false)

        } catch (err) {
            console.log(err)
        }

    }

    const handleNavigator = async (id: string) => {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`)
        alert("A URL foi copiada com sucesso!")
    }

    const handleDeleteDoc = async (id: string) => {
        const docRef = doc(db, "tasks", id)
        await deleteDoc(docRef)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual é a sua tarefa?</h1>
                        <form onSubmit={handleRegisterTask}>
                            <TextArea placeholder="Digite qual é a sua tarefa..." value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
                            <div className={styles.checkboxArea}>
                                <input type="checkbox" className={styles.checkbox} checked={publicTask} onChange={handleChangePublic} />
                                <label>Deixar tarefa pública</label>
                            </div>
                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    {tasks.map((item) => (
                        <article key={item.id} className={styles.task}>
                            {item.public ? (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}>PÚBLICA</label>
                                    <button className={styles.shareButton}>
                                        <FiShare2 size={22} color="#3183ff" onClick={() => handleNavigator(item.id)} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tagPrivate}>PRIVADA</label>
                                </div>
                            )}
                            <div className={styles.taskContent}>
                                {item.public ? (
                                    <Link href={`/task/${item.id}`}>
                                        <p>{item.task}</p>
                                    </Link>
                                ) : (
                                    <p>{item.task}</p>
                                )}

                                <button className={styles.trashButton} onClick={() => handleDeleteDoc(item.id)}>
                                    <FaTrash size={24} color="#ea3140" />
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {
            user: {
                email: session.user?.email
            }
        }
    }
}
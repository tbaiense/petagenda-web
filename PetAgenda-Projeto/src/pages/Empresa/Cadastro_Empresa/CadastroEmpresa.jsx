import styles from "./CadastroEmpresa.module.css"
import { useForm } from "react-hook-form"
import api from  '../../../api';
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CadastroEmpresa = () => {
    const { token } = useAuth();

    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState:{errors},
        watch,
        reset
    } = useForm();

    const imagemEmpresa = watch("pathImgFile")
    const imagemURL = imagemEmpresa && imagemEmpresa[0] ? URL.createObjectURL(imagemEmpresa[0]) : null

    const onSubmit = async (data) => {
        console.log(typeof data);
        const fileFoto = data.pathImgFile.item(0);
        const byteString = await fileFoto.bytes();
        const base64 = byteString.toBase64();

        const objEmp = {
            nomeFantasia: data.NomeFantasia,
            razaoSocial: data.RazaoSocial,
            cnpj: data.CNPJ,
            lema: data.Lema,
            foto: {
                type: fileFoto.type,
                data: base64
            }
        };

        fetch(`${api.URL}/empresa`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objEmp)
        }).then( res => { 
            if (res.status == 200) {
                alert('cadastrado');
                navigate("/dashboard/Planos")
            } else {
                alert('erro ao cadastrar empresa');
            }
        });
    }

    const onError = (errors) => {
        console.log("Erro ao Enviar:",errors)
    }

    return(

        <div className={styles.areaDoCadastro}>

            <h2>Cadastro</h2>

            <div className={styles.cardCadastro}>

                <form className={styles.formCadastro} onSubmit={handleSubmit(onSubmit, onError)}>

                    <input type="text" placeholder="Nome Fantasia:" 
                    {...register("NomeFantasia", {
                        required:"O nome fantasia é obrigatório",
                        minLength:{
                            value:10,
                            message:"O nome fantasia deve ter pelo menos 10 caracteres"
                        },
                        maxLength:{
                            value:80,
                            message:"O nome fantasia dever ter no maximo 80 caracteres"
                        }
                    })} />
                    {errors.NomeFantasia && <p className={styles.error}>{errors.NomeFantasia.message}</p>}

                    <input type="text" placeholder="Razão Social:" 
                    {...register("RazaoSocial", {
                        required:"A razão social é obrigatório",
                        minLength:{
                            value:10,
                            message:"O razão social deve ter pelo menos 10 caracteres"
                        },
                        maxLength:{
                            value:80,
                            message:"O razão social dever ter no maximo 80 caracteres"
                        }
                    })} />
                    {errors.RazaoSocial && <p className={styles.error}>{errors.RazaoSocial.message}</p>}

                    <input type="text" placeholder="CNPJ:" 
                    {...register("CNPJ", {
                        required:"O CNPJ é obrigatório",
                        minLength:{
                            value:10,
                            message:"O CNPJ deve ter pelo menos 10 caracteres"
                        },
                        maxLength:{
                            value:80,
                            message:"O CNPJ dever ter no maximo 80 caracteres"
                        },
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "O CNPJ deve conter apenas números"
                        }
                    })} />
                    {errors.CNPJ && <p className={styles.error}>{errors.CNPJ.message}</p>}

                    <textarea id={styles.inputLema} placeholder="Lema:" 
                    {...register("Lema", {
                        minLength:{
                            value:10,
                            message:"O Lema deve ter pelo menos 10 caracteres"
                        },
                        maxLength:{
                            value:80,
                            message:"O Lema dever ter no maximo 150 caracteres"
                        }
                    })} />
                    {errors.Lema && <p className={styles.error}>{errors.Lema.message}</p>}

                    <input type="file" {...register("pathImgFile")}/>
                    
                    <div className={styles.bttn}> 
                        <button type="submit">Finalizar</button>
                        <button type="button" onClick={() => reset()}>Limpar</button>
                    </div>
                </form>

                <div className={styles.viewImg}>
                    {imagemURL && <img src={imagemURL} alt="Pre-Visualização" width={200} height={210}/>}
                    <h2>Foto de Perfil</h2>
                </div>
                
            </div>
        </div>

    )
}

export default CadastroEmpresa
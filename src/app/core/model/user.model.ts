
export interface User{
    id_nomad?:string
    last_name_nomad?:string
    first_name_nomad?:string
    msisdn_nomad?:number
    motif_rejet?:string
    is_checked?:boolean
    type_piece_nomad?:string
}

export interface RootUser{
    infoData?:User[]
    total?:number
}



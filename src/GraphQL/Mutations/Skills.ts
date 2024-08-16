import { gql } from "@apollo/client";

export const ADD_SKILL_MUTAION = gql`
mutation createSkill($title:String!, $proficiency:Int){
    createSkill(title:$title, proficiency:$proficiency){
        title
        proficiency
    }
}
`;

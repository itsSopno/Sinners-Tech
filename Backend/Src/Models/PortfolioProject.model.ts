import { Document, model, Schema } from "mongoose";

interface IProjectDetails extends Document {
    projectName: String,
    projectDescription: String,
    projectImage: String,
    projectLiveLink: String,
    projectGitHubLink: String,
    projectTags: String[],
    projectStatus: String,
    projectType: String,
    projectDemoLink: String,
    projectThumbnail: String,
    Tech:String[],

}

const projectDetailSchema = new Schema<IProjectDetails>({
    projectName:{
        type:String,
        required:true
    },
    projectDescription:{
        type:String,
        required:true
    },
    projectImage:{
        type:String,
        required:true
    },
    projectLiveLink:{
        type:String,
        required:true
    },
    projectGitHubLink:{
        type:String,
        required:true
    },
    projectTags:{
        type:[String],
        required:true
    },
    projectStatus:{
        type:String,
        required:true
    },
    projectType:{
        type:String,
        required:true
    },
    projectDemoLink:{
        type:String,
        required:true
    },
    projectThumbnail:{
        type:String,
        required:true
    },
    Tech:{
        type:[String],
        required:true
    },
    
})
const ProjectDetail = model<IProjectDetails>("ProjectDetail", projectDetailSchema);
export default ProjectDetail;
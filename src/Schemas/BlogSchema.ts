import * as Yup from 'yup';
const BlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});
export default BlogSchema;

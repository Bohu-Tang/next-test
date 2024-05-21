"use server"
import {z} from 'zod';
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

// 发票表单数据格式
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({invalid_type_error: 'Please select a customer'}),
  amount: z.coerce.number().gt(0, {message:"Please enter an amount greater than $0."}),
  status: z.enum(['pending', 'paid'], {invalid_type_error: 'Please select an invoice status.'}),
  date: z.string()
})

export type State= {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string| null;
}

// 创建一个新的模式， 排除id、date
const CreateInvoice = FormSchema.omit({id: true, date: true})

export async function createInvoice(prevState: State,formData: FormData) {

  // 创建表单校验
  const validatedFields= CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if(!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create invoice."
    }
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  const rawFormData = {
    customerId,
    amount: amountInCents,
    status,
    date
  }
  console.log('创建发票的参数：', rawFormData);
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
  } catch (e) {
    return {message: 'Database error: Failed to create invoice.'}
  }

  revalidatePath('/dashboard/invoices'); // 重新刷新invoice页面的数据，但并不是跳转到invoice页面
  redirect('/dashboard/invoices'); // 跳转到invoice页面

}

// 修改发票
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function updateInvoice(id: string,prevState: State, formData: FormData) {
  // const {customerId, amount, status} = UpdateInvoice.parse({
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
  console.log('修改发票的参数：', validatedFields);
  // 如果校验失败，返回错误信息
  if(!validatedFields.success){
    return{
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update invoice."
    }
  }
  // 校验成功，更新发票
  const {customerId, amount, status} = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (e) {
    return {message: 'Database error: Failed to update invoice.'}
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 删除发票
export async function deleteInvoice(id: string) {
  try {
    await sql` DELETE FROM invoices WHERE id = ${id} `;
  } catch (e) {
    return {message: 'Database error: Failed to delete invoice items.'}
  }

  revalidatePath('/dashboard/invoices');
}
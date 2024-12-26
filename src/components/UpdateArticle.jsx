import React, { useEffect, useRef, useState } from 'react'
import { createArticleAPI, updateArticleAPI } from '../service/api';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { CloudUpload, Send } from '@mui/icons-material';
import styled from 'styled-components';
import { LoadingButton } from '@mui/lab';
import useFetch from '../hooks/useFetch';

const UpdateArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const ref = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])
  const headers = {
    "Content-Type": "multipart/form-data"
  }
  const { data } = useFetch(`/api/article/${id}/`, { headers });
  useEffect(() => {
    if (data) {
      setTitle(data.title)
      setContent(data.content)
    }
  }, [data])
  useEffect(() => {
    console.log(ref.current?.files);
  }, [ref])
  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      author: user.username
    }
    const formData = new FormData(e.target)
    formData.forEach((val, key) => {
      if (key == "image") {
        if (ref.current?.files[0]) {
          body[key] = ref.current?.files[0]
        }
      } else {
        body[key] = val
      }
    })
    const token = localStorage.getItem("token")
    try {
      const res = await updateArticleAPI(id, body, token)
      setError(false)
      navigate(`/articles/${res.id}`)
    } catch (error) {
      setError(true)
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const resetHandler = () => {
    setContent("")
    setTitle("")
  }
  return (
    <div className='min-h-[calc(100vh-100px)] justify-center flex items-center'>
      <form onSubmit={formSubmit} className="w-[400px] shadow px-5 py-10 rounded">
        <h3 className='font-bold text-3xl text-center mb-5'>Create an article</h3>
        <TextField value={title} onChange={e => setTitle(e.target.value)} label="Title" variant='outlined' name='title' className='w-full' />
        <Button
          component="label"
          className='w-full'
          sx={{ my: 1 }}
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUpload />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            name='image'
            ref={ref}
            multiple
          />
        </Button>
        <TextField value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 1 }} label="Content" variant='outlined' name='content' className='w-full' />
        {error && <p className='text-sm text-red-500 text-center mb-5 font-semibold'>Something wen wrong. Error 500</p>}
        <LoadingButton
          endIcon={<Send />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          type='submit'
        >
          Update
        </LoadingButton>
        <Button onClick={resetHandler} type="reset" sx={{ ml: 2 }} color="info">Reset</Button>
      </form>
    </div>
  )
}

export default UpdateArticle
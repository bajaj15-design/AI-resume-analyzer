import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };

      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;

        read: (
          path: string
        ) => Promise<Blob>;

   upload: (file: File[] | Blob[]) => Promise<FSItem[]>;

        delete: (
          path: string
        ) => Promise<void>;

        readdir: (
          path: string
        ) => Promise<FSItem[] | undefined>;
      };

      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<Object>;

        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };

      kv: {
        get: (
          key: string
        ) => Promise<string | null>;

        set: (
          key: string,
          value: string
        ) => Promise<boolean>;

        delete: (
          key: string
        ) => Promise<boolean>;

        list: (
          pattern: string,
          returnValues?: boolean
        ) => Promise<string[]>;

        flush: () => Promise<boolean>;
      };
    };
  }
}


interface PuterStore {

  isLoading: boolean;
  error: string | null;
  puterReady: boolean;


  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;

    signIn: () => Promise<void>;
    signOut: () => Promise<void>;

    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;

    getUser: () => PuterUser | null;
  };


  fs: {

    write: (
      path: string,
      data: string | File | Blob
    ) => Promise<File | undefined>;


    read: (
      path: string
    ) => Promise<Blob | undefined>;


  upload: (file: File[] | Blob[]) => Promise<FSItem[] | undefined>;


    delete: (
      path: string
    ) => Promise<void>;


    readDir: (
      path: string
    ) => Promise<FSItem[] | undefined>;

  };


  ai: {

    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;


    feedback: (
      path: string,
      message: string
    ) => Promise<AIResponse | undefined>;


    img2txt: (
      image: string | File | Blob,
      testMode?: boolean
    ) => Promise<string | undefined>;

  };


  kv: {

    get: (
      key: string
    ) => Promise<string | null | undefined>;


    set: (
      key: string,
      value: string
    ) => Promise<boolean | undefined>;


    delete: (
      key: string
    ) => Promise<boolean | undefined>;


    list: (
      pattern: string,
      returnValues?: boolean
    ) => Promise<string[] | KVItem[] | undefined>;


    flush: () => Promise<boolean | undefined>;

  };


  init: () => void;

  clearError: () => void;
}


const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter
    ? window.puter
    : null;export const usePuterStore = create<PuterStore>((set, get) => {

  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
    });
  };


  const checkAuthStatus = async (): Promise<boolean> => {

    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return false;
    }

    set({
      isLoading: true,
      error: null,
    });


    try {

      const isSignedIn = await puter.auth.isSignedIn();


      if (isSignedIn) {

        const user = await puter.auth.getUser();


        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => user,
          },

          isLoading: false,
        });


        return true;

      } else {


        set({

          auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => null,
          },

          isLoading: false,

        });


        return false;

      }


    } catch (error) {


      setError(
        error instanceof Error
          ? error.message
          : "Auth check failed"
      );


      return false;

    }

  };



  const signIn = async (): Promise<void> => {

    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return;
    }


    try {

      await puter.auth.signIn();

      await checkAuthStatus();


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Sign in failed"
      );

    }

  };



  const signOut = async (): Promise<void> => {

    const puter = getPuter();


    if (!puter) {
      setError("Puter.js not available");
      return;
    }


    try {

      await puter.auth.signOut();


      set({

        auth:{
          user:null,
          isAuthenticated:false,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser:()=>null
        },

        isLoading:false

      });


    } catch(error){

      setError(
        error instanceof Error
        ? error.message
        : "Sign out failed"
      );

    }

  };



  const refreshUser = async (): Promise<void> => {

    const puter = getPuter();


    if(!puter){
      setError("Puter.js not available");
      return;
    }


    try{

      const user = await puter.auth.getUser();


      set({

        auth:{
          user,
          isAuthenticated:true,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser:()=>user
        },

        isLoading:false

      });


    }catch(error){

      setError(
        error instanceof Error
        ? error.message
        :"User refresh failed"
      );

    }

  };



  const init = () => {

    const puter = getPuter();


    if(puter){

      set({
        puterReady:true
      });

      checkAuthStatus();

      return;

    }


    const interval = setInterval(()=>{

      if(getPuter()){

        clearInterval(interval);

        set({
          puterReady:true
        });

        checkAuthStatus();

      }

    },100);



    setTimeout(()=>{

      clearInterval(interval);

      if(!getPuter()){

        setError(
          "Puter.js failed to load"
        );

      }

    },10000);

  };
    const write = async (
    path: string,
    data: string | File | Blob
  ) => {
    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    return puter.fs.write(path, data);
  };


  const readFile = async (
    path: string
  ) => {

    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    return puter.fs.read(path);

  };


const upload = async (
  files: File[] | Blob[]
): Promise<FSItem[] | undefined> => {
  const puter = getPuter();

  if (!puter) {
    setError("Puter.js not available");
    return;
  }

  return puter.fs.upload(files);
};


  const deleteFile = async (
    path: string
  ) => {

    const puter = getPuter();

    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    return puter.fs.delete(path);

  };



  const readDir = async (
    path:string
  ) => {

    const puter = getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.fs.readdir(path);

  };



  const feedback = async (
    path:string,
    message:string
  ) => {

    const puter = getPuter();


    if(!puter){
      setError("Puter.js not available");
      return;
    }


    return puter.ai.chat(
      [
        {
          role:"user",
          content:[
            {
              type:"file",
              puter_path:path
            },
            {
              type:"text",
              text:message
            }
          ]
        }
      ],
      {
        model:"claude-sonnet-4"
      }

    ) as Promise<AIResponse>;

  };



  const chat = async (
    prompt:string | ChatMessage[],
    imageURL?:string | PuterChatOptions,
    testMode?:boolean,
    options?:PuterChatOptions
  )=>{

    const puter=getPuter();


    if(!puter){
      setError("Puter.js not available");
      return;
    }


    return puter.ai.chat(
      prompt,
      imageURL,
      testMode,
      options
    ) as Promise<AIResponse>;

  };



  const img2txt = async(
    image:string | File | Blob,
    testMode?:boolean
  )=>{

    const puter=getPuter();


    if(!puter){
      setError("Puter.js not available");
      return;
    }


    return puter.ai.img2txt(
      image,
      testMode
    );

  };



  const getKV = async(key:string)=>{

    const puter=getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.kv.get(key);

  };



  const setKV = async(
    key:string,
    value:string
  )=>{

    const puter=getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.kv.set(key,value);

  };



  const deleteKV = async(key:string)=>{

    const puter=getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.kv.delete(key);

  };



  const listKV = async(
    pattern:string,
    returnValues?:boolean
  )=>{

    const puter=getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.kv.list(
      pattern,
      returnValues
    );

  };



  const flushKV = async()=>{

    const puter=getPuter();

    if(!puter){
      setError("Puter.js not available");
      return;
    }

    return puter.kv.flush();

  };



  return {

    isLoading:true,
    error:null,
    puterReady:false,


    auth:{
      user:null,
      isAuthenticated:false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser:()=>get().auth.user
    },


    fs:{
      write,
      read:readFile,
      upload,
      delete:deleteFile,
      readDir
    },


    ai:{
      chat,
      feedback,
      img2txt
    },


    kv:{
      get:getKV,
      set:setKV,
      delete:deleteKV,
      list:listKV,
      flush:flushKV
    },


    init,

    clearError:()=>set({
      error:null
    })

  };

});